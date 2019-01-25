import { Input, Output, EventEmitter } from "@angular/core";
import { Component } from "@angular/core";
import { Settings } from "../../providers";

@Component({
  selector: "budget-slider",
  templateUrl: "budget-slider.html"
})
export class BudgetSliderComponent {
  @Input()
  public value: number;
  public rangeMaxValue: number;
  public actualMaxValue: number;
  public presetBudgets: number[];

  private static ScaleFactor = 100000;

  @Output() valueChanged = new EventEmitter<number>();
  constructor(settings: Settings) {
      let allSettings = settings.allSettings;
      this.actualMaxValue = allSettings.maxBudget;
      this.rangeMaxValue = this.actualToRangeValue(this.actualMaxValue);
      this.value = this.value? this.value : allSettings.defaultBudget;
      this.presetBudgets = allSettings.presetBudgets;
  }

  set _value(value: number) {
    this.value = this.rangeValueToActual(value);
    this.valueChanged.emit(this.value);
  }

  get _value() {
    return this.actualToRangeValue(this.value);
  }

  public setActualValue(value: number){
    this._value = this.actualToRangeValue(value);
  }

  private rangeValueToActual(value: number): number {
    return value * BudgetSliderComponent.ScaleFactor;
  }

  private actualToRangeValue(value: number): number {
    return value / BudgetSliderComponent.ScaleFactor;
  }
}
