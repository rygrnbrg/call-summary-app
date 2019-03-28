import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Items } from "../../providers";
import { LeadPropertyMetadataProvider } from "../../providers/lead-property-metadata/lead-property-metadata";
import { LeadPropertyMetadata, LeadPropertyType } from "../../models/lead-property-metadata";
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
  relevant: boolean;

  private leadPropertiesMetadata: LeadPropertyMetadata[];
  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    leadPropertyMetadataProvider: LeadPropertyMetadataProvider,
    private numberFormatPipe: NumberFormatPipe
  ) {
    this.leadPropertiesMetadata = leadPropertyMetadataProvider.get();
    this.item = navParams.get("item");
    this.properties = this.getProperties();
    this.relevant = this.item.relevant;
  }

  private getProperties(): ItemProperty[] {
    let props: ItemProperty[] = [];

    this.leadPropertiesMetadata.forEach(item => {
      props.push({
        icon: item.icon,
        title: item.title,
        value: this.getPropertyString(item)
      });
    });

    return props;
  }

  private getPropertyString(property: LeadPropertyMetadata): string {
    switch (property.type) {

      case LeadPropertyType.Budget:
        return this.getBudget(this.item.budget);

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
