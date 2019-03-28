
import {
  PropertyOption,
  LeadPropertyType,
  DealType,
  LeadType
} from "./../../models/lead-property-metadata";
import { LeadFilter } from "./../../models/lead-filter";
import { LeadPropertyMetadataProvider } from "./../../providers/lead-property-metadata/lead-property-metadata";
import { Component } from "@angular/core";
import { IonicPage, ViewController, NavParams } from "ionic-angular";
import { LeadPropertyMetadata } from "../../models/lead-property-metadata";
import { NumberFormatPipe } from "../../pipes/number-format/number-format";

@IonicPage()
@Component({
  selector: "page-leads-filter",
  templateUrl: "leads-filter.html",
  providers: [NumberFormatPipe]
})
export class LeadsFilterPage {
  public filters: LeadFilter[];
  public leadPropertyType = LeadPropertyType;
  public leadPropertyMetadata: LeadPropertyMetadata[];
  public dealType: DealType;

  constructor(
    private viewCtrl: ViewController,
    private numberFormatPipe: NumberFormatPipe,
    private navParams: NavParams,
    private leadPropertyMetadataProvider: LeadPropertyMetadataProvider
  ) {
    this.leadPropertyMetadata = leadPropertyMetadataProvider.get();
  }

  public getFilterValueString(filter: LeadFilter): string {
    let value = LeadPropertyMetadata.getValueString(filter.metadata, filter.value);
    if (filter.type === LeadPropertyType.Budget) {
      let numberValue = Number.parseInt(value);
      if (!isNaN(numberValue)) {
        return this.getBudgetString(numberValue);
      }
    }

    return value;
  }

  private getBudgetString(value: number): string {
    let transform = this.numberFormatPipe.transform;
    return transform(value).toString();
  }

  public filterClick(filter: LeadFilter) {
    let selected = filter.selected;
    this.filters.forEach(filter => (filter.selected = false));
    filter.selected = !selected;
  }

  public optionClick(filter: LeadFilter, option: PropertyOption): void {
    switch (filter.type) {
      case LeadPropertyType.StringSingleValue:
        this.handleSingleOptionValueClick(filter, option);
        filter.value = option.selected? option.title : null;
        break;

      case LeadPropertyType.StringMultivalue:
        option.selected = !option.selected;
        filter.value = filter.metadata.options.filter(option => option.selected).map(option => option.title);
        break;

      default:
        break;
    }

    filter.selected = false;
  }

  public setBudget(filter: LeadFilter, value: number) {
    filter.value = value;
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
    this.filters = this.leadPropertyMetadata.filter(x=> x.filterable).map(
      md =>
        <LeadFilter>{
          id: md.id,
          metadata: md,
          selected: false,
          type: md.type,
          value: null
        }
    );

    let paramsfilters: LeadFilter[] = this.navParams.get("filters");
    let leadType: LeadType = this.navParams.get("leadType");
    this.dealType = this.leadPropertyMetadataProvider.getDealTypeByLeadType(leadType.id);
    if (paramsfilters) {
      paramsfilters.forEach(paramFilter => {
        let index = this.filters.findIndex(filter => filter.id === paramFilter.id);
        this.filters[index] = paramFilter;
      });
    }

  }

  done() {
    this.viewCtrl.dismiss(this.filters);
  }
}
