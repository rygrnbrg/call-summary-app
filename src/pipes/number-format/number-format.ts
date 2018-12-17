import { Pipe, PipeTransform } from '@angular/core';
/**
 * Generated class for the NumberFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if (value > 1000000){
      return value/1000000 + "M";
    }
    if (value > 100000){
      return value/100000 + "K";
    }
    
    return value;
  }
}
