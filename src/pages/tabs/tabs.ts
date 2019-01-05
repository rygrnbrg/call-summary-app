import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

import { Tab1Root, Tab2Root } from '../';
import { User } from '../../providers';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabRef: Tabs;

  tabs: string[] = [
    Tab1Root,
    Tab2Root
  ];

  tab1Title = "";
  tab2Title = "";
  constructor(public navCtrl: NavController, public translateService: TranslateService, public navParams: NavParams, private user: User) {

  }

  ionViewDidLoad() {
    let tab = this.navParams.get('tab');
    if (tab) {
      this.tabRef.select(this.tabs.indexOf(tab));
    }
  }
}
