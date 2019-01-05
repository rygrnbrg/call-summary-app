import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadsFilterPage } from './leads-filter';

@NgModule({
  declarations: [
    LeadsFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadsFilterPage),
  ],
})
export class LeadsFilterPageModule {}
