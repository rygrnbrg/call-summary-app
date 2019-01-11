import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadsPage } from './leads';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    LeadsPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadsPage),
    TranslateModule.forChild(),
    PipesModule, 
    ComponentsModule
  ],
  exports: [
    LeadsPage
  ]
})
export class LeadsPageModule { }
