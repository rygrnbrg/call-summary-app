import { Component } from '@angular/core';

/**
 * Generated class for the BudgetSliderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'budget-slider',
  templateUrl: 'budget-slider.html'
})
export class BudgetSliderComponent {

  text: string;

  constructor() {
    console.log('Hello BudgetSliderComponent Component');
    this.text = 'Hello World';
  }

}
