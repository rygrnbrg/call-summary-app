import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { User } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage, MainPage } from '..';
import { AuthenticationData } from '../../models/authentication';

/**
 * Generated class for the SendVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-verification',
  templateUrl: 'send-verification.html',
})
export class SendVerificationPage {
  private translations: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: User,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public translateService: TranslateService) {
    translateService.get(['SEND_VERIFICATION_SENT_SUCCESS_TITLE', 'SEND_VERIFICATION_SENT_SUCCESS_MESSAGE', 'VERIFY_BUTTON', 'GENERAL_LATER']).subscribe(values => {
      this.translations = values;
    });
  }

  sendVerification() {
    this.user.sendVerificationEmail().then(
      () => this.showPrompt(),
      (err) => this.showToast(err)
    )
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: this.translations.SEND_VERIFICATION_SENT_SUCCESS_TITLE,
      message: this.translations.SEND_VERIFICATION_SENT_SUCCESS_MESSAGE,
      buttons: [
        {
          text: this.translations.GENERAL_LATER,
          cssClass: "danger-color",
          handler: data => {
            this.navCtrl.push(LoginPage);
          }
        }, {
          text: this.translations.VERIFY_BUTTON,
          handler: data => {
            this.doLogin();
          }
        }]
    });
    prompt.present();
  }

  doLogin() {
    var account: AuthenticationData = { email: this.navParams.get("email"), password: this.navParams.get("password") };
    this.user.login(account).then(
      res => {
        this.navCtrl.push(MainPage);
      },
      (err: Error) => {
        this.showToast(err.message);
      });
  }

  login() {
    this.navCtrl.setRoot('LoginPage');
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendVerificationPage');
  }

}
