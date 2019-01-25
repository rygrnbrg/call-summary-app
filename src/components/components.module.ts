import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { LeadsListComponent } from './leads-list/leads-list';
import { PipesModule } from '../pipes/pipes.module';
import { IonicModule } from 'ionic-angular';
import { BudgetSliderComponent } from './budget-slider/budget-slider';
import { FilteredByComponent } from './filtered-by/filtered-by';

@NgModule({
	declarations: [LeadsListComponent,
    BudgetSliderComponent,
    FilteredByComponent],
	imports: [
		TranslateModule.forChild(),
		PipesModule,
		IonicModule
	],
	exports: [LeadsListComponent,
    BudgetSliderComponent,
    FilteredByComponent]
})
export class ComponentsModule {}
