import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagePage } from './message';
import { SMS } from '@ionic-native/sms/ngx';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MessagePage,
  ],
  imports: [
    IonicPageModule.forChild(MessagePage),
    TranslateModule.forChild()
  ],
  providers: [
    SMS
  ]
})
export class MessagePageModule {}
