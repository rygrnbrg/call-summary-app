import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the AvatarPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'avatar',
})
export class AvatarPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {

  }

  transform(value: string): any {
    // if (value && value.length) {
    //   return this.domSanitizer.bypassSecurityTrustUrl(value);
    // }

    return 'assets/img/profile_avatar.png';
  }
}
