import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { PresentationViewComponent } from './presentation-view/presentation-view.component';
import { FireSceneComponent } from './scenes/fire-scene/fire-scene.component';
import { InitiativeTrackerComponent } from './scenes/initiative-tracker/initiative-tracker.component';
import { StorybookComponent } from './scenes/storybook/storybook.component';

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
	declarations: [
		PresentationViewComponent,
		InitiativeTrackerComponent,
		FireSceneComponent,
		StorybookComponent,
	],
})
export class PresentationModule {}
