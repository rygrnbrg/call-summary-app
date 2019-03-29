import { Contact } from './../../models/lead';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Platform } from 'ionic-angular';
import { SMS } from '@ionic-native/sms/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { smsResult } from '../../models/smsResult';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  public contacts: Contact[] = [];
  public contactsHeaderLimit: number = 5;
  public messageText: string = "";
  private translations: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sms: SMS,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private viewCtrl: ViewController,
    private platform: Platform,
    private androidPermissions: AndroidPermissions
  ) {
    this.translateService.get([
      'SMS_MESSAGE_WILL_BE_SENT_TO', 'CONTACTS', 'GENERAL_CANCEL', 'GENERAL_APPROVE']).subscribe(values => {
        this.translations = values;
      });

    this.contacts = this.navParams.get("contacts");
  }


  ionViewDidLoad() {
    this.askAndroidSMSPermissions();
  }

  private askAndroidSMSPermissions() {
    if (this.platform.is("cordova")) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
        result => console.log('Ceck permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(requestResult => {
          console.log('Request permission?', requestResult.hasPermission)
        })
      );
    }
  }

  public removeContact(contact: Contact) {
    this.contacts.splice(this.contacts.indexOf(contact), 1);
  }

  public send() {
    if (this.contacts.length === 1) {
      this.sendSMS();
    }
    else {
      this.presentConfirmSMS();
    }
  }

  public cancel() {
    this.viewCtrl.dismiss();
  }

  private getSmsPermission(): void {
    if (this.platform.is("cordova")) {
      this.sms.hasPermission().then((granted: boolean) => {
        if (!granted) {
          this.viewCtrl.dismiss(true);
        }
      });
    }
  }


  private presentConfirmSMS() {
    let message = `${this.translations.SMS_MESSAGE_WILL_BE_SENT_TO}-${this.contacts.length} ${this.translations.CONTACTS}`;
    const prompt = this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: this.translations.GENERAL_CANCEL,
          handler: data => {

          },
          cssClass: 'danger-color'
        },
        {
          text: this.translations.GENERAL_APPROVE,
          handler: data => {
            this.sendSMS();
          },
          cssClass: 'primary'
        }
      ]
    });
    prompt.present();
  }

  private sendSMS() {
    let phones = this.contacts.map(contact => contact.phone);
    if (this.platform.is("cordova")) {
      this.sms.send(phones, this.messageText).then(
        (value) => {
          console.log(value);
          let result: smsResult = { success: true, sentCount: phones.length };
          this.viewCtrl.dismiss(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
    }
    else {
      let result: smsResult = { success: true, sentCount: phones.length };
      this.viewCtrl.dismiss(result);
    }

  }
}
