import { LeadFilter } from './../../models/lead-filter';
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { LeadsProvider } from '../../providers/leads/leads';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers';
import { LeadPropertyType } from '../../models/lead-property-metadata';

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
  activeFilters: LeadFilter[];
  filterSearchRunning: boolean;

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
        this.leads = res.map(lead => this.leadsProvider.convertDbObjectToLead(lead));
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
  
  sendMessage() {
    // let modal = this.modalCtrl.create('MessagePage', { items: });
    // modal.onDidDismiss(item => {
    //   if (item) {
    //     this.leadsProvider.add(item);
    //   }
    // })
    // modal.present();
  }

  public filterLeadsClick(): void {
    let filterModal = this.modalCtrl.create('LeadsFilterPage');
    filterModal.onDidDismiss((data: LeadFilter[]) => {
      if (!data) {
        return;
      }

      this.leadsSearchResults = []
      let filters = data.filter(item => item.value !== null);
      if (!filters.length) {
        this.activeFilters = null;
        return;
      }

      this.activeFilters = filters;
      let multivalueFilters = this.activeFilters.filter(filter => filter.type === LeadPropertyType.StringMultivalue);

      this.filterSearchRunning = true;
      this.leadsProvider.filter(this.activeFilters).get().then(
        (querySnapshot) => {
          this.filterSearchRunning = false;
          querySnapshot.forEach(doc => {
            let data = doc.data();
            let isNotIncludedInMultivalueFilters =
              multivalueFilters.some(filter => !this.isIncludedInMultivalueFilter(filter, data));
            if (isNotIncludedInMultivalueFilters) {
              return;
            }
            this.leadsSearchResults.push(data);
          });
        }
      )
    });

    filterModal.present();
  }

  private isIncludedInMultivalueFilter(filter: LeadFilter, lead: any) {
    return (<string[]>filter.value).some(value => (<string[]>lead[filter.id]).indexOf(value) > -1);
  }

  public cleanFilters() {
    this.activeFilters = null;
  }

  public searchHasNoResults() {
    return (!this.filterSearchRunning) && this.leadsSearchResults && this.leadsSearchResults.length === 0 && this.activeFilters;
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
