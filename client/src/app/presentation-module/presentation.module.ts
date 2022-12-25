import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { OrderTrackerComponent } from './order-tracker/order-tracker.component';
import { PresentationViewComponent } from './presentation-view/presentation-view.component';

const routes: Routes = [
	{
		path: '',
		component: PresentationViewComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		ColorPickerModule,
		FormsModule,
		RouterModule.forChild(routes),
		MatButtonModule,
		MatIconModule,
		MatInputModule,
	],
	declarations: [PresentationViewComponent, OrderTrackerComponent],
})
export class PresentationModule {}
