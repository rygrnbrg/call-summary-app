import { LeadPropertyMetadataProvider } from './../../providers/lead-property-metadata/lead-property-metadata';
import { NumberFormatPipe } from './../../pipes/number-format/number-format';
import { LeadPropertyMetadata } from './../../models/lead-property-metadata';
import { Input } from '@angular/core';
import { LeadFilter } from './../../models/lead-filter';
import { Component } from '@angular/core';
import { LeadPropertyType } from '../../models/lead-property-metadata';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'filtered-by',
  templateUrl: 'filtered-by.html',
  providers: [NumberFormatPipe]
})
export class FilteredByComponent {
  @Input()
  filters: LeadFilter[];
  private translations: any;
  
  public leadPropertyType = LeadPropertyType;

  constructor(public numberFormatPipe: NumberFormatPipe, public translateService: TranslateService) {
    this.translateService.get([
      'LEAD_RELEVANCE_SHOW_ONLY_RELEVANT_TRUE']).subscribe(values => {
        this.translations = values;
      });
  }

  public getFilterValueString(filter: LeadFilter): string {
    if (filter.id === LeadPropertyMetadataProvider.relevanceKey){
      if (filter.value === true) {
        return this.translations.LEAD_RELEVANCE_SHOW_ONLY_RELEVANT_TRUE;
      }
    }
    if (!filter.metadata){
      return "";
    }
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

}
