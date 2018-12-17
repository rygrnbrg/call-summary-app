import { NgModule } from '@angular/core';
import { NumberFormatPipe } from './number-format/number-format';
import { AvatarPipe } from './avatar/avatar';
@NgModule({
	declarations: [NumberFormatPipe,
    AvatarPipe],
	imports: [],
	exports: [NumberFormatPipe,
    AvatarPipe]
})
export class PipesModule {}
