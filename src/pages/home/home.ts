import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController } from 'ionic-angular';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { Caller } from '../../models/caller';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { Lead } from '../../models/lead';
import { interval, Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AvatarPipe]
})
export class HomePage {
  log: Lead[];
  keys: string[];
  private logUpdateSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private callLog: CallLog,
    private platform: Platform,
    private modalCtrl: ModalController) {
    this.updateLog();
  }

  ionViewDidEnter() {
    const source = interval(1000);
    this.logUpdateSubscription = source.subscribe(val => this.updateLog());
  }

  ionViewCanLeave() {
    this.logUpdateSubscription.unsubscribe();
  }

  public updateLog() {
    if (this.platform.is("cordova")) {
      if (this.platform.is("android")) {
        this.callLog.hasReadPermission().then(hasPermission => {
          if (hasPermission) {
            this.callLog.getCallLog(this.getLogFilter(3)).then((result: Caller[]) => {
              let freshLog = this.getUniqueCallerLog(result);
              if (!this.areEqualLogs(this.log, freshLog)) {
                this.log = freshLog;
              }

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
      let log: Caller[] = [];
      for (let index = 0; index < 10; index++) {
        log.push(<Caller>{ number: "052862665" + index, name: "caller" + index });
      }
      for (let index = 0; index < 10; index++) {
        log.push(<Caller>{ number: "052862665" + index, name: "caller" + index });
      }

      let freshLog = this.getUniqueCallerLog(log);
      if (!this.areEqualLogs(this.log, freshLog)) {
        this.log = freshLog;
      }
    }
  }

  private areEqualLogs(first: Lead[], second: Lead[]): boolean {
    if (!first || !second || first.length !== second.length) {
      return false;
    }

    return first.every((value, index) => second[index].phone === value.phone);
  }

  private getUniqueCallerLog(log: Caller[]): Lead[] {
    let fullLog = log.slice(0, 100).map((x) => new Lead(x.number, x.name));
    let uniqueItemsLog: Lead[] = [];

    fullLog.forEach(item => {
      let existingItem = uniqueItemsLog.find(x => x.phone === item.phone);

      if (!existingItem) {
        uniqueItemsLog.push(item);
      }
    });

    return uniqueItemsLog;
  }

  public openItem(item?: Lead) {
    if (!item){
      item = new Lead("","");
    }
    
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
