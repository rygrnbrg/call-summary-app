import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Tabs, NavOptions } from 'ionic-angular';
import { Tab1Root, Tab2Root, Tab3Root } from '../';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabRef: Tabs;

  tabs: string[] = [
    Tab1Root,
    Tab2Root,
    Tab3Root
  ];

  tab1Title = "";
  tab2Title = "";
  tab3Title = "";
  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService,
    public navParams: NavParams,
    public localSorage: Storage
  ) {

  }

  ionViewDidLoad() {
    let tab = this.navParams.get('tab');

    if (tab) {
      this.tabRef.select(this.tabs.indexOf(tab));
      this.setParamsOnStorage();
    }
  }

  private setParamsOnStorage(): void {
    let params = this.navParams.get('params');
    if (params) {
      this.localSorage.set("params", params);
    }
  }
}
