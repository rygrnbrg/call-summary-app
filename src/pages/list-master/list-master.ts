import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { LeadsProvider } from '../../providers/leads/leads';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  providers: [AvatarPipe]
})
export class ListMasterPage {
  leads$: Observable<firebase.firestore.DocumentData[]>;

  constructor(public navCtrl: NavController, public leadsProvider: LeadsProvider, public modalCtrl: ModalController) {

  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.leads$ = this.leadsProvider.get();
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
