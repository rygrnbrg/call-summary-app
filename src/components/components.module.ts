import { NgModule } from '@angular/core';
import { LeadsListComponent } from './leads-list/leads-list';
import { PipesModule } from '../pipes/pipes.module';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [LeadsListComponent],
	imports: [
		PipesModule,
		IonicModule
	],
	exports: [LeadsListComponent]
})
export class ComponentsModule {}
