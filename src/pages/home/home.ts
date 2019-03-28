import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController } from 'ionic-angular';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { Caller } from '../../models/caller';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Lead } from '../../models/lead';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AvatarPipe]
})
export class HomePage {
  log: Lead[];
  keys: string[];

  constructor(
    public navCtrl: NavController,
    private callLog: CallLog,
    private platform: Platform,
    private modalCtrl: ModalController) {
    this.updateLog();
  }

  public updateLog() {
    if (this.platform.is("cordova")) {
      if (this.platform.is("android")) {
        this.callLog.hasReadPermission().then(hasPermission => {
          if (hasPermission) {
            this.callLog.getCallLog(this.getLogFilter(3)).then((result: Caller[]) => {
              this.log = result.slice(0, 10).map((logItem) => new Lead(logItem.number, logItem.name));
            });
          }
          else {
            this.callLog.requestReadPermission().then((value) => {
              this.updateLog();
            });
          }
        });
      }
    }
    else {//todo: mock remove
      this.log = [];
      for (let index = 0; index < 10; index++) {
        this.log.push(new Lead("052862665" + index, "caller" + index));
      }
    }
  }

  public openItem(item: Lead) {
    let addModal = this.modalCtrl.create('ItemCreatePage', { item: item });
    addModal.present();
  }

  private getLogFilter(numberOfDays: number) {
    let logFilter: CallLogObject[] = [{
      "name": "date",
      "value": new Date().setDate(new Date().getDate() - numberOfDays).toString(),
      "operator": ">="
    }];
    return logFilter
  }
}
