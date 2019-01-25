import { NumberFormatPipe } from './../../pipes/number-format/number-format';
import { LeadPropertyMetadata } from './../../models/lead-property-metadata';
import { Input } from '@angular/core';
import { LeadFilter } from './../../models/lead-filter';
import { Component } from '@angular/core';
import { LeadPropertyType } from '../../models/lead-property-metadata';

@Component({
  selector: 'filtered-by',
  templateUrl: 'filtered-by.html',
  providers: [NumberFormatPipe]
})
export class FilteredByComponent {
  @Input()
  filters: LeadFilter[];

  public leadPropertyType = LeadPropertyType;

  constructor(public numberFormatPipe: NumberFormatPipe) {

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

}
