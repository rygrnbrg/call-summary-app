import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages';
import { Settings, User } from '../providers';
import { AvatarPipe } from '../pipes/avatar/avatar';

@Component({
  templateUrl: 'app.html',
  providers: [AvatarPipe]
})
export class MyApp {
  rootPage = FirstRunPage;
  email: string = "";

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Home', component: 'HomePage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Leads', component: 'LeadsPage' },
  ]

  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config,
    private statusBar: StatusBar, private splashScreen: SplashScreen, private user: User) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
    this.subscribeToAuthChange();
  }

  initTranslate() {
    this.translate.setDefaultLang('he');
    this.translate.use('he')
    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  public logout() {
    this.user.logout();
  }

  private subscribeToAuthChange(): void {
    this.user.authenticationState().subscribe((res) => {
      if (!res) {
        this.gotoPage("Login");
        return;
      }

      if (res.emailVerified) {
        this.user.loginExistingUser(res);
        this.email = res.email;
        this.gotoPage("Tabs");
        return
      }
      
      this.gotoPage("SendVerification", { email: res.email })
    });
  }

  private gotoPage(page: string, params?: any) {
    page = page + "Page";
    if (!this.nav.getActive() || this.nav.getActive().name !== page) {
      this.nav.setRoot(page, params);
    }
  }
}
