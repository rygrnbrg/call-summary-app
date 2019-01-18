import {
  PropertyOption,
  LeadPropertyType
} from "./../../models/lead-property-metadata";
import { LeadFilter } from "./../../models/lead-filter";
import { LeadPropertyMetadataProvider } from "./../../providers/summary-slides/summary-slides";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { LeadPropertyMetadata } from "../../models/lead-property-metadata";

@IonicPage()
@Component({
  selector: "page-leads-filter",
  templateUrl: "leads-filter.html"
})
export class LeadsFilterPage {
  filters: LeadFilter[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private leadPropertyMetadataProvider: LeadPropertyMetadataProvider
  ) {}

  public getFilterValueString(filter: LeadFilter): string {
    return LeadPropertyMetadata.getValueString(filter.metadata);
  }

  public filterClick(filter: LeadFilter) {
    let selected = filter.selected;
    this.filters.forEach(filter => (filter.selected = false));
    filter.selected = !selected;
  }

  public optionClick(filter: LeadFilter, option: PropertyOption): void {
    switch (filter.metadata.type) {
      case LeadPropertyType.StringSinglValue:
        this.handleSingleOptionValueClick(filter, option);
        break;

      case LeadPropertyType.StringMultivalue:
        option.selected = !option.selected;
        break;

      default:
        break;
    }
  }

  private handleSingleOptionValueClick(
    filter: LeadFilter,
    option: PropertyOption
  ) {
    let selected = option.selected;
    filter.metadata.options.forEach(option => (option.selected = false));
    option.selected = !selected;
  }

  ionViewWillEnter() {
    let metadata = this.leadPropertyMetadataProvider.get();
    this.filters = metadata.map(md => <LeadFilter>{ id: md.id, metadata: md });
  }

  done() {
    this.viewCtrl.dismiss(this.filters);
  }
}
