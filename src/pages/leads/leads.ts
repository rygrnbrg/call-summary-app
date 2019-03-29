import { LeadPropertyMetadataProvider } from './../../providers/lead-property-metadata/lead-property-metadata';
import { LeadType, LeadPropertyType, DealType } from './../../models/lead-property-metadata';
import { LeadFilter } from './../../models/lead-filter';
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { LeadsProvider } from '../../providers/leads/leads';
import { Lead, Contact } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers';
import { rangeValue } from '../../components/range-budget-slider/range-budget-slider';
import { smsResult } from '../../models/smsResult';

@IonicPage()
@Component({
  selector: 'page-leads',
  templateUrl: 'leads.html',
  providers: [AvatarPipe]
})
export class LeadsPage {
  leadsDictionary: { [id: string]: firebase.firestore.DocumentData[] } = {};
  leads: firebase.firestore.DocumentData[];
  queryLeadsSearchResults: firebase.firestore.DocumentData[];
  leadsSearchResults: firebase.firestore.DocumentData[];
  subscriptions: Subscription[];
  loading: Loading;
  translations: any;
  activeFilters: LeadFilter[];
  filterSearchRunning: boolean;
  leadTypes: LeadType[];
  selectedLeadType: LeadType;
  selectedDealType: DealType;
  showBudgetSlider: boolean = false;
  budgetMinMaxValues: rangeValue;
  budgetValue: rangeValue;
  totalLeadCount: number;
  viewLeadCount: number;
  leadsFoundMessage: string;

  constructor(
    private navCtrl: NavController,
    private leadsProvider: LeadsProvider,
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private toastCtrl: ToastController,
    private leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    private user: User) {
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create();
    this.subscriptions = [];
    this.leadTypes = LeadType.getAllLeadTypes();
    this.selectedLeadType = this.leadTypes[0];
    this.selectedDealType = this.leadPropertyMetadataProvider.getDealTypeByLeadType(this.selectedLeadType.id);
    this.loading.present();
    this.initLeadSubscription();

    let translationSubscription = this.translateService.get([
      'LIST_LOADING_ERROR', 'LEADS_RECIEVED_MESSAGE', 'LEADS_FOUND']).subscribe(values => {
        this.translations = values;
      });

    this.subscriptions.push(translationSubscription);
  }

  private initLeadSubscription() {
    let leadTypeKey = this.selectedLeadType.id.toString().toLowerCase();

    if (this.leadsDictionary[leadTypeKey]) {
      this.leads = this.leadsDictionary[leadTypeKey];
    }
    else {
      this.leadsProvider.get(this.selectedLeadType.id).get().then(
        (res) => {
          this.leadsDictionary[leadTypeKey] = res.docs.map(lead => this.leadsProvider.convertDbObjectToLead(lead.data(), this.selectedLeadType.id));
          this.leads = this.leadsDictionary[leadTypeKey];
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
    }
  }
 
  public filterLeadsClick(): void {
    let filterModal = this.modalCtrl.create('LeadsFilterPage', { "filters": this.activeFilters, "leadType": this.selectedLeadType });
    filterModal.onDidDismiss((data: LeadFilter[]) => {
      if (!data) {
        return;
      }
      this.queryLeadsSearchResults = []
      let filters = data.filter(item => item.value !== null);
      if (!filters.length) {
        this.activeFilters = null;
        return;
      }

      this.activeFilters = filters;
      this.filterSearchRunning = true;
      let loading = this.loadingCtrl.create();
      loading.present();
      this.leadsProvider.filter(this.activeFilters, this.selectedLeadType.id).get().then(
        (querySnapshot) => {
          loading.dismiss();
          this.filterSearchRunning = false;
          this.setBudgetMinMaxValues(querySnapshot);
          this.setShowBudgetSlider();
          this.leadsFoundMessage = this.translations.LEADS_FOUND.replace("{numberOfLeads}", querySnapshot.size);
          querySnapshot.forEach(doc => {
            let data = doc.data();
            this.queryLeadsSearchResults.push(data);
          });
          this.filterLeadsByRange();
        }
      ).catch(reason=> loading.dismiss());
    });

    filterModal.present();
  }


  ionViewDidLeave() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.loading.dismiss();
  }

  private showToast(message: string) {
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
    let leads = this.activeFilters ? this.leadsSearchResults : this.leads;
    let contacts = leads.map((lead: Lead) => new Contact(lead.phone, lead.name));
    let modal = this.modalCtrl.create('MessagePage', { contacts: contacts });
    modal.onDidDismiss((result: smsResult) => {
      if (result && result.success) {
        let message = this.translations.LEADS_RECIEVED_MESSAGE.replace("{numberOfLeads}", result.sentCount);
        this.showToast(message);
      }
    })
    modal.present();
  }

  public budgetChanged(range: rangeValue) {
    this.budgetValue = range;
    this.filterLeadsByRange();
  }

  public leadTypeChanged(leadType: LeadType) {
    this.selectedLeadType = leadType;
    this.selectedDealType = this.leadPropertyMetadataProvider.getDealTypeByLeadType(this.selectedLeadType.id);
    this.initLeadSubscription();
    this.cleanFilters();
  }

  private filterLeadsByRange() {
    let filteredQueryResults = this.queryLeadsSearchResults.filter(x => this.inBudgetRange(x));
    this.leadsSearchResults = filteredQueryResults.map(lead => this.leadsProvider.convertDbObjectToLead(lead, this.selectedLeadType.id));
  }

  private setShowBudgetSlider(): void {
    if (!this.budgetMinMaxValues || !this.activeFilters) {
      this.showBudgetSlider = false;
    }
    else if (this.budgetMinMaxValues.upper === this.budgetMinMaxValues.lower) {
      this.showBudgetSlider = false;
    }
    else {
      this.showBudgetSlider = true;
    }
  }

  private setBudgetMinMaxValues(querySnapshot: firebase.firestore.QuerySnapshot): void {
    if (!querySnapshot || querySnapshot.size === 0) {
      this.budgetMinMaxValues = { lower: 0, upper: 0 };
      return;
    }

    let range: rangeValue = { lower: 100000000, upper: 0 };
    let budgetFilterId = this.leadPropertyMetadataProvider.get().find(x => x.type === LeadPropertyType.Budget);

    querySnapshot.forEach(doc => {
      let data = doc.data();
      let value = <number>data[budgetFilterId.id];
      if (value < range.lower) {
        range.lower = value;
      }
      if (value > range.upper) {
        range.upper = value;
      }
    });

    this.budgetMinMaxValues = range;
    this.budgetValue = range;
  }

  private inBudgetRange(lead: any) {
    let budgetFilterId = this.leadPropertyMetadataProvider.get().find(x => x.type === LeadPropertyType.Budget);
    let value = <number>lead[budgetFilterId.id];
    return value >= this.budgetValue.lower && value <= this.budgetValue.upper;
  }

  public cleanFilters() {
    this.activeFilters = null;
    this.showBudgetSlider = false;
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
