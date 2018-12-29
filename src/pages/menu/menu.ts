import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController } from 'ionic-angular';

interface PageItem {
  title: string
  component: any
}
type PageList = PageItem[]

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'ContentPage';

  pages: PageList;

  constructor(public navCtrl: NavController) {
    // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Sign in', component: 'LoginPage' },
    //   { title: 'Signup', component: 'SignupPage' }
    // ];
  }

  ionViewDidLoad() {

  }

  openPage(page: PageItem) {
    this.nav.setRoot(page.component);
  }
}
