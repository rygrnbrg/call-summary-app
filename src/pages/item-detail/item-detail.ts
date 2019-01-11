import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';
import { LeadPropertyMetadataProvider } from '../../providers/summary-slides/summary-slides';
import { LeadPropertyMetadata } from '../../models/lead-property-metadata';
import { Lead } from '../../models/lead';
import { AvatarPipe } from '../../pipes/avatar/avatar';
import { NumberFormatPipe } from '../../pipes/number-format/number-format';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
  providers: [AvatarPipe, NumberFormatPipe]
})

export class ItemDetailPage {
  item: Lead;
  properties: ItemProperty[];
  private slides: LeadPropertyMetadata[];
  constructor(public navCtrl: NavController, navParams: NavParams, 
  items: Items, leadPropertyMetadataProvider: LeadPropertyMetadataProvider, private numberFormatPipe: NumberFormatPipe) {
    this.slides = leadPropertyMetadataProvider.get();
    this.item = navParams.get('item');
    this.properties = this.getProperties();
  }

  private getProperties(): ItemProperty[] {
    let props: ItemProperty[] = [];

    this.slides.forEach(slide => {
      props.push({
        icon: slide.icon,
        title: slide.title,
        value: this.getValueBySlide(slide)
      });
    });

    return props;
  }

  private getValueBySlide(slide: LeadPropertyMetadata): string {
    if (slide.isBudgetRange){
      return  `${this.getBudget(this.item.budgetMin)} - ${this.getBudget(this.item.budgetMax)}`
    }

    let value: string[] = this.item[slide.id];
    return value.join(', ');
  }

  private getBudget(value: number): string {
    let transform = this.numberFormatPipe.transform;
    return transform(value).toString();
  }
}

export interface ItemProperty {
  icon: string;
  title: string;
  value: any
}
