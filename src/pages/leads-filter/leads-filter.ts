import { LeadFilter } from './../../models/lead-filter';
import { LeadPropertyMetadataProvider } from './../../providers/summary-slides/summary-slides';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leads-filter',
  templateUrl: 'leads-filter.html',
})
export class LeadsFilterPage {
  filters: LeadFilter[];

  constructor(private navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController,
    private leadPropertyMetadataProvider: LeadPropertyMetadataProvider) {

  }

  ionViewWillEnter() {
    let metadata = this.leadPropertyMetadataProvider.get();
    this.filters = metadata.map(md => <LeadFilter>{ id: md.id, metadata : md });  
  }

  ionViewDidLoad() {

  }

  done() {
    this.viewCtrl.dismiss(this.filters);
  }

}
