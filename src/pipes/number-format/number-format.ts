import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number) {
    if (!value){
      return "0";
    }
    if (value >= 1000000){
      return value/1000000 + "M";
    }
    if (value >= 100000){
      return value/1000 + "K";
    }
    
    return value.toFixed(0);
  }
}
