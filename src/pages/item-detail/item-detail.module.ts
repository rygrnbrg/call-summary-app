import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ItemDetailPage } from './item-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  providers: [
    CallNumber
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule { }
