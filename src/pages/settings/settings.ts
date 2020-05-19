import { Area } from './../../providers/user/user';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../providers';
import { Settings } from '../../providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;
  settingsReady = false;

  form: FormGroup;
  profileSettings = {
   page: 'profile',
   pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  areasSettings = {
    page: 'areas',
    pageTitleKey: 'SETTINGS_PAGE_AREAS'
  };
  public areas : Area[];
  private translations: any;

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    private alertCtrl: AlertController,
    private user: User) {
      this.translate.get([
        'SMS_MESSAGE_WILL_BE_SENT_TO', 'CONTACTS', 'GENERAL_CANCEL', 'GENERAL_APPROVE']).subscribe(values => {
          this.translations = values;
        });
  }
  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3],
    };
    
    switch (this.page) {
      case 'main':
        break;
       case 'profile':
         group = {
           option4: [this.options.option4]
         };
         break;
      case 'areas':
        this.areas = this.user.getUserData().areas;
        break;
    }
     // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
       this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  public confirmAreaRemove(area: Area) {
    let message = `${this.translations.SETTINGS_AREAS_DELETE_CONFIRM}`;
    message.replace('{area}', area.name);
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
            this.removeArea(area).then();
          },
          cssClass: 'primary'
        }
      ]
    });
    prompt.present();
  }

  private removeArea(area: Area): Promise<void>{
    return this.user.removeArea(area).then(()=>{
      this.areas.splice(this.areas.indexOf(area));
    });
  }
}
