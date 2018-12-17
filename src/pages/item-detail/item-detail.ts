import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';
import { SummarySlidesProvider } from '../../providers/summary-slides/summary-slides';
import { SummarySlide } from '../../models/summary-slide';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  private slides: SummarySlide[];
  constructor(public navCtrl: NavController, navParams: NavParams, items: Items, summarySlidesProvider: SummarySlidesProvider) {
    this.item = navParams.get('item') || items.defaultItem;   
    this.slides = summarySlidesProvider.get();
  }

  getSlide(slideId: string): SummarySlide{
    return this.slides.find((slide)=> slide.id === slideId);
  }

}
