import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { Items } from "../../providers";
import { LeadPropertyMetadataProvider } from "../../providers/summary-slides/summary-slides";
import {
  LeadPropertyMetadata,
  LeadPropertyType
} from "../../models/lead-property-metadata";
import { Lead } from "../../models/lead";
import { AvatarPipe } from "../../pipes/avatar/avatar";
import { NumberFormatPipe } from "../../pipes/number-format/number-format";

@IonicPage()
@Component({
  selector: "page-item-detail",
  templateUrl: "item-detail.html",
  providers: [AvatarPipe, NumberFormatPipe]
})
export class ItemDetailPage {
  item: Lead;
  properties: ItemProperty[];
  private slides: LeadPropertyMetadata[];
  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    items: Items,
    leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    private numberFormatPipe: NumberFormatPipe
  ) {
    this.slides = leadPropertyMetadataProvider.get();
    this.item = navParams.get("item");
    this.properties = this.getProperties();
  }

  private getProperties(): ItemProperty[] {
    let props: ItemProperty[] = [];

    this.slides.forEach(slide => {
      props.push({
        icon: slide.icon,
        title: slide.title,
        value: this.getPropertyString(slide)
      });
    });

    return props;
  }

  private getPropertyString(property: LeadPropertyMetadata): string {
    switch (property.type) {
      
      case LeadPropertyType.Budget:
        return `${this.getBudget(this.item.budgetMin)} - ${this.getBudget(
          this.item.budgetMax
        )}`;

      case LeadPropertyType.StringMultivalue:
        let value: string[] = this.item[property.id];
        return value.join(", ");

      default:
        return this.item[property.id];
    }
  }

  private getBudget(value: number): string {
    let transform = this.numberFormatPipe.transform;
    return transform(value).toString();
  }
}

export interface ItemProperty {
  icon: string;
  title: string;
  value: any;
}
