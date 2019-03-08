import { Contact } from './../../models/lead';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { SMS } from '@ionic-native/sms/ngx';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  public contacts: Contact[];
  public contactsHeaderLimit: number = 5;
  public messageText: string = "";
  private translations: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sms: SMS,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private viewCtrl: ViewController
  ) {
    this.translateService.get([
      'SMS_MESSAGE_WILL_BE_SENT_TO', 'CONTACTS', 'GENERAL_CANCEL', 'GENERAL_APPROVE']).subscribe(values => {
        this.translations = values;
      });

    this.contacts = [
      { name: "Roy Grinberg", phone: "0528626684" },
      { name: "Roy Grinberg", phone: "0528626684" },
      { name: "Roy Grinberg", phone: "0528626684" },
      { name: "Roy Grinberg", phone: "0528626684" },
      { name: "Roy Grinberg", phone: "0528626684" },
      { name: "Roy Grinberg", phone: "0528626684" },
      { name: "Roy Grinberg", phone: "0528626684" },
    ];

  }


  ionViewDidLoad() {
    this.sms.hasPermission().then((granted: boolean)=>{
      if (!granted){
        this.viewCtrl.dismiss(true);
      }
    });
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
    this.sms.send(phones, this.messageText).then(
      (value) => {
        this.viewCtrl.dismiss(true);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
}
