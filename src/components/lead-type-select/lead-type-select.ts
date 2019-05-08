import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LeadType } from '../../models/lead-property-metadata';

@Component({
  selector: 'lead-type-select',
  templateUrl: 'lead-type-select.html'
})
export class LeadTypeSelectComponent {
  leadTypes: LeadType[];
  selectedLeadType: LeadType;

  @Input() public value: LeadType;
  @Input() public label: string;
  @Input() public dropdownSelect: boolean;
 
  @Output() valueChanged = new EventEmitter<LeadType>();
  constructor() {
    this.initValue();
  }

  private initValue() {
    if (this.value) {
      this.selectedLeadType = this.value;
    }
    else {
      this.leadTypes = LeadType.getAllLeadTypes();
      this.selectedLeadType = this.leadTypes[0];
    }
  }

  public compareWithLeadType(currentValue: LeadType, compareValue: LeadType): boolean {
    return currentValue.id === compareValue.id;
  }

  public leadTypeChanged(leadType: LeadType) {
    this.selectedLeadType = leadType;
    this.valueChanged.emit(this.selectedLeadType);
  }
}
