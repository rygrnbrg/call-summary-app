import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { LeadsProvider } from '../../providers/leads/leads';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  providers: [AvatarPipe]
})
export class ListMasterPage {
  leads: firebase.firestore.DocumentData[];
  loading: Loading;
  translations: any;

  constructor(private navCtrl: NavController, private leadsProvider: LeadsProvider,
    private modalCtrl: ModalController, loadingCtrl: LoadingController, 
    translateService: TranslateService, private toastCtrl: ToastController) {
    this.loading = loadingCtrl.create();

    translateService.get([
      'LIST_LOADING_ERROR']).subscribe(values => {
        this.translations = values;
      });
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.loading.present();
    this.leadsProvider.get().subscribe(
      (res) => { 
        this.leads = res;
        this.loading.dismiss();
      },
      (err) => {        
        this.loading.dismiss();
        console.error(err);
        this.showToast(this.translations.LIST_LOADING_ERROR);
      },
      () => {
        
      }
    );
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in ao
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.leadsProvider.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item: Lead) {
    this.leadsProvider.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Lead) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
