import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';
import { SummarySlidesProvider } from '../../providers/summary-slides/summary-slides';
import { SummarySlide } from '../../models/summary-slide';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
  providers: [AvatarPipe]
})

export class ItemDetailPage {
  item: any;
  properties: ItemProperty[];
  private slides: SummarySlide[];
  constructor(public navCtrl: NavController, navParams: NavParams, items: Items, summarySlidesProvider: SummarySlidesProvider) {
    this.slides = summarySlidesProvider.get();
    this.item = navParams.get('item') || items.defaultItem;
    this.properties = this.getProperties();
  }

  private getProperties(): ItemProperty[] {
    let properties: ItemProperty[] = [];
    let leadObject = new Lead("", "", {});
    let keys = Object.keys(this.item);
    let leadKeys = Object.keys(leadObject);

    keys.forEach(key => {
      if (leadKeys.indexOf(key) === -1) {
        let slide = this.getSlide(key);
        properties.push({
          icon: slide.icon,
          title: slide.title,
          value: this.item[key]
        });
      }
    });

    return properties;
  }

  private getSlide(slideId: string): SummarySlide {
    return this.slides.find((slide) => slide.id === slideId);
  }

}

export interface ItemProperty {
  icon: string;
  title: string;
  value: any
}
