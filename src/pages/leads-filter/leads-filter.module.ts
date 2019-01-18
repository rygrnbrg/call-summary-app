import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadsFilterPage } from './leads-filter';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LeadsFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadsFilterPage),
    TranslateModule.forChild()
  ]
})
export class LeadsFilterPageModule {}
