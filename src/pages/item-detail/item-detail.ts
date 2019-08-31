import { Contact } from './../../models/lead';
import { LeadsProvider } from './../../providers/leads/leads';
import { Component } from "@angular/core";
import { IonicPage, NavParams, ToastController, ModalController, AlertController, ViewController, Platform } from "ionic-angular";
import { LeadPropertyMetadataProvider } from "../../providers/lead-property-metadata/lead-property-metadata";
import { LeadPropertyMetadata, LeadPropertyType } from "../../models/lead-property-metadata";
import { Lead } from "../../models/lead";
import { AvatarPipe } from "../../pipes/avatar/avatar";
import { NumberFormatPipe } from "../../pipes/number-format/number-format";
import { TranslateService } from '@ngx-translate/core';
import { smsResult } from '../../models/smsResult';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Subscription } from 'rxjs';
import { Comment, CommentType } from '../../models/comment';
import { firestore } from 'firebase';

@IonicPage()
@Component({
  selector: "page-item-detail",
  templateUrl: "item-detail.html",
  providers: [AvatarPipe, NumberFormatPipe]
})
export class ItemDetailPage {
  public item: Lead;
  public properties: ItemProperty[];
  public relevant: boolean;
  private translations: any;
  private leadPropertiesMetadata: LeadPropertyMetadata[];
  private subscriptions: Subscription[];

  constructor(
    navParams: NavParams,
    leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    private toastCtrl: ToastController,
    private leadsProvider: LeadsProvider,
    private numberFormatPipe: NumberFormatPipe,
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private callNumber: CallNumber,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private platform: Platform
  ) {
    this.leadPropertiesMetadata = leadPropertyMetadataProvider.get();
    let item = navParams.get("item");
    this.loadItem(item);
    // this.refreshItem();
  }

  ionViewDidLoad() {
    let backButtonSubscription = this.platform.backButton.subscribe(()=> this.cancel());
    this.subscriptions = [];

    let translationSubscription = this.translateService.get([
      'GENERAL_ACTION_ERROR', 'LEADS_RECIEVED_MESSAGE']).subscribe(values => {
        this.translations = values;
      });

    this.subscriptions.push(translationSubscription, backButtonSubscription);
  }

  ionViewDidLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private loadItem(item: Lead) {
    this.item = item;
    this.properties = this.getProperties();
    this.relevant = this.item.relevant;
  }

  private refreshItem() {
    let promise = this.leadsProvider.getQuerySnapshotPromise(this.item);
    promise.then((querySnapshot) => {
      querySnapshot.forEach((x: firestore.QueryDocumentSnapshot) => {
        let lead = this.leadsProvider.convertDbObjectToLead(x.data(), this.item.type);
        this.loadItem(lead);
      });
    });
  }

  private getProperties(): ItemProperty[] {
    let props: ItemProperty[] = [];

    this.leadPropertiesMetadata.forEach(item => {
      props.push({
        icon: item.icon,
        title: item.title,
        value: this.getPropertyString(item)
      });
    });

    return props;
  }

  public call() {
    this.callNumber.callNumber(this.item.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  public relevantChanged() {
    this.leadsProvider.updateLeadRelevance(this.item, this.relevant).then(() => {
      this.item.relevant = this.relevant;
    }).catch(() => {
      this.showToast(this.translations.GENERAL_ACTION_ERROR);
      this.relevant = this.item.relevant;
    });
  }

  private showToast(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public sendMessage(): void {
    let leads = [this.item];
    let contacts = leads.map((lead: Lead) => new Contact(lead.phone, lead.name));
    let modal = this.modalCtrl.create('MessagePage', { contacts: contacts });
    modal.onDidDismiss((result: smsResult) => {
      if (result && result.success) {
        let message = this.translations.LEADS_RECIEVED_MESSAGE.replace("{numberOfLeads}", result.sentCount);
        this.showToast(message);
        this.addMessageSentComments(result.text);
      }
    })
    modal.present();
  }


  private addMessageSentComments(text: string) {
    let comment = new Comment(text, new Date(Date.now()), "", CommentType.MessageSent);

    let convertedLead = this.leadsProvider.convertDbObjectToLead(this.item, this.item.type)
    this.leadsProvider.addComment(convertedLead, comment).then(x => this.refreshItem());
  }

  public openComment(comment: Comment) {
    const prompt = this.alertCtrl.create({
      message: comment.text
    });
    prompt.present();
  }

  public addNote() {
    let modal = this.modalCtrl.create('CommentPage', { lead: this.item });
    modal.onDidDismiss((result) => {
      if (result.success) {
        console.log("Comment added successfully")
        this.refreshItem();
      }
      else {
        console.log("Failed to add comment");
      }
    })
    modal.present();
  }

  public getCommentIcon(comment: Comment) {
    switch (comment.commentType) {
      case CommentType.UserComment:
        return "create";
      case CommentType.MessageSent:
        return "text";
      default:
        return "clipboard";
    }
  }

  public getCommentTitle(comment: Comment) {
    switch (comment.commentType) {
      case CommentType.MessageSent:
        return 'MESSAGE_SENT_TITLE';
      case CommentType.UserComment:
        return '';
      default:
        return '';
    }
  }

  private getPropertyString(property: LeadPropertyMetadata): string {
    switch (property.type) {

      case LeadPropertyType.Budget:
        return this.getBudget(this.item.budget);

      case LeadPropertyType.StringMultivalue:
        let value: string[] = this.item[property.id];
        return value.join(", ");

      default:
        return this.item[property.id];
    }
  }

  public cancel() {
    this.viewCtrl.dismiss(this.item);
  }

  private getBudget(value: number): string {
    let transform = this.numberFormatPipe.transform;
    return transform(value).toString();
  }
}

export interface ItemProperty {
  icon: string;
  title: string;
  value: any;
}
