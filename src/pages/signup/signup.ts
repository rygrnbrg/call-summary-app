import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import { User } from '../../providers';
import { MainPage, LoginPage, SendVerificationPage } from '../';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'rygrnbrg@gmail.com',
    password: 'test1234'
  };

  private translations: any;
  constructor(
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public translateService: TranslateService) {
    translateService.get(['VERIFY_TITLE', 'VERIFY_MESSAGE', 'VERIFY_BUTTON', 'GENERAL_LATER']).subscribe(values => {
      this.translations = values;
    });
  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account).then((resp) => {
      this.user.sendVerificationEmail().then(
        () => {
          this.showPrompt();
        },
        err => this.navCtrl.setRoot(SendVerificationPage, { email: this.account.email, password: this.account.password })
      )
    }, (err: Error) => {
      this.showToast(err.message);
    });
  }

  doLogin() {
    this.user.login(this.account).then(
      res => {
        this.navCtrl.push(MainPage);
      },
      (err: Error) => {
        this.showToast(err.message);
      });
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: this.translations.VERIFY_TITLE,
      message: this.translations.VERIFY_MESSAGE,
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
}
