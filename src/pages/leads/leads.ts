import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { LeadsProvider } from '../../providers/leads/leads';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-leads',
  templateUrl: 'leads.html',
  providers: [AvatarPipe]
})
export class LeadsPage {
  leads: firebase.firestore.DocumentData[];
  leadsSearchResults: firebase.firestore.DocumentData[];
  subscriptions: Subscription[];
  loading: Loading;
  translations: any;

  constructor(private navCtrl: NavController, private leadsProvider: LeadsProvider,
    private modalCtrl: ModalController, loadingCtrl: LoadingController,
    private translateService: TranslateService, private toastCtrl: ToastController, private user: User) {
    this.loading = loadingCtrl.create();
    this.subscriptions = [];
  }

  ionViewDidLoad() {
    this.loading.present();
    let leadsSubscription = this.leadsProvider.get().subscribe(
      (res) => {
        this.leads = res.map(lead=> this.leadsProvider.convertDbObjectToLead(lead));
        this.loading.dismiss();
      },
      (err) => {
        if (this.user.getUserData() === null) {
          return;
        }

        this.loading.dismiss();
        console.error(err);
        this.showToast(this.translations.LIST_LOADING_ERROR);
      });

    let translationSubscription = this.translateService.get([
      'LIST_LOADING_ERROR']).subscribe(values => {
        this.translations = values;
      });

    this.subscriptions.push(leadsSubscription, translationSubscription);
  }

  ionViewDidLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.loading.dismiss();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  addItem() {
    let modal = this.modalCtrl.create('ItemCreatePage');
    modal.onDidDismiss(item => {
      if (item) {
        this.leadsProvider.add(item);
      }
    })
    modal.present();
  }

  public filterLeadsClick(){
    this.leadsSearchResults = [];
    let filterModal = this.modalCtrl.create('LeadsFilterPage');
    filterModal.onDidDismiss(data => {
     this.leadsProvider.filter(data).get().then(
       (querySnapshot)=>{
         querySnapshot.forEach(doc=>{
           this.leadsSearchResults.push(doc.data());
         });
       }
     )
   });
   
    filterModal.present();
  }

  deleteItem(item: Lead) {
    this.leadsProvider.delete(item);
  }

  itemClicked(item: Lead) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
