import { ToastController } from 'ionic-angular';
import { Area, UserData } from './../../providers/user/user';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ModalController } from 'ionic-angular';
import { User } from '../../providers';
import { Settings } from '../../providers';
import { AvatarPipe } from "../../pipes/avatar/avatar";

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [AvatarPipe]
})
export class SettingsPage {
  public areas : Area[];
  public userData: UserData;  

  private loading: Loading;
  private translations: any;
  private newAreaName: string;

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

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public user: User) {
      this.translate.get([
        'SETTINGS_AREAS_DELETE_CONFIRM', 'GENERAL_CANCEL', 'GENERAL_APPROVE',
        'SETTINGS_AREAS_ADD_TITLE', 'SETTINGS_AREAS_ADD_PLACEHOLDER','GENERAL_ACTION_ERROR',
        'SETTINGS_AREAS_ADD_SUCCESS']).subscribe(values => {
          this.translations = values;
        });
  }
  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3],
    };
    
    this.userData = this.user.getUserData();
    switch (this.page) {
      case 'main':
        break;
       case 'profile':
         group = {
           option4: [this.options.option4]
         };
         break;
      case 'areas':
        this.areas = this.userData.areas;
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

  public logout() {
    this.user.logout();
  }

  public confirmAreaRemove(area: Area) {
    let message = `${this.translations.SETTINGS_AREAS_DELETE_CONFIRM}`;
    message = message.replace('{area}', '"' + area.name + '"');
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
            this.removeArea(area);
          },
          cssClass: 'primary'
        }
      ]
    });
    prompt.present();
  }

  private removeArea(area: Area): Promise<void>{
    this.loading = this.loadingCtrl.create();
    this.loading.present()
    return this.user.removeArea(area).then(()=>{
      this.loading.dismiss();
      this.areas.splice(this.areas.indexOf(area), 1);
    });
  }

  public addAreaModal() {
    this.newAreaName = "";
    const prompt = this.alertCtrl.create({
      title: this.translations.SETTINGS_AREAS_ADD_TITLE,
      cssClass: "rtl-modal",
      inputs: [
        {
          name: 'area',
          placeholder: this.translations.SETTINGS_AREAS_ADD_PLACEHOLDER,
          value: this.newAreaName
        },
      ],
      buttons: [
        {
          text: this.translations.GENERAL_CANCEL,
          handler: data => {

          }
        },
        {
          text: this.translations.GENERAL_APPROVE,
          handler: data => {
            this.loading = this.loadingCtrl.create();
            this.loading.present()
            this.user.addArea(data.area).then(()=>{
              this.areas = this.user.getUserData().areas;
              this.loading.dismiss();
              this.showToast(this.translations.SETTINGS_AREAS_ADD_SUCCESS);
            }, ()=>{            
              this.showToast(this.translations.GENERAL_ACTION_ERROR);
            });//todo:handle error
          }
        }
      ]
    });
    prompt.present();
  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
