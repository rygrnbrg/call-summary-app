import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leads-filter',
  templateUrl: 'leads-filter.html',
})
export class LeadsFilterPage {

  filterValues;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadsFilterPage');
  }

  done(){
    this.viewCtrl.dismiss(this.filterValues);
  }

}
