import { LeadsProvider } from './../../providers/leads/leads';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController } from "ionic-angular";
import { Items } from "../../providers";
import { LeadPropertyMetadataProvider } from "../../providers/lead-property-metadata/lead-property-metadata";
import { LeadPropertyMetadata, LeadPropertyType } from "../../models/lead-property-metadata";
import { Lead } from "../../models/lead";
import { AvatarPipe } from "../../pipes/avatar/avatar";
import { NumberFormatPipe } from "../../pipes/number-format/number-format";
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    navParams: NavParams,
    leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    private toastCtrl: ToastController,
    private leadsProvider: LeadsProvider,
    private numberFormatPipe: NumberFormatPipe,
    private translateService: TranslateService
  ) {
    this.leadPropertiesMetadata = leadPropertyMetadataProvider.get();
    this.item = navParams.get("item");
    this.properties = this.getProperties();
    this.relevant = this.item.relevant;
  }

    ionViewDidLoad() {
    let translationSubscription = this.translateService.get([
      'GENERAL_ACTION_ERROR']).subscribe(values => {
        this.translations = values;
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

  public relevantChanged(){
    this.leadsProvider.updateLeadRelevance(this.item, this.relevant).then(()=>{
      this.item.relevant = this.relevant;
    }).catch(()=>{
      this.showToast(this.translations.GENERAL_ACTION_ERROR);
      this.relevant = this.item.relevant;
    });
  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
