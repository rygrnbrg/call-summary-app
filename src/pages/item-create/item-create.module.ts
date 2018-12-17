import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemCreatePage } from './item-create';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ItemCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ItemCreatePage),
    TranslateModule.forChild(),
    PipesModule
  ],
  exports: [
    ItemCreatePage
  ]
})
export class ItemCreatePageModule { }
