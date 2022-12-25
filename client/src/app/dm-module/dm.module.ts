import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxEditorModule } from 'ngx-editor';
import { BattleTrackerComponent } from './battle-tracker/battle-tracker.component';
import { DmViewComponent } from './dm-view/dm-view.component';
import { AnimationLayerComponent } from './led/animation-layer/animation-layer.component';
import { DeviceComponent } from './led/device/device.component';
import { LedStripComponent } from './led/led-strip/led-strip.component';
import { LEDComponent } from './led/led/led.component';
import { NotesComponent } from './notes/notes.component';

const routes: Routes = [
	{
		path: '',
		component: DmViewComponent,
		children: [
			{
				path: 'battle',
				component: BattleTrackerComponent,
			},
			{
				path: 'led',
				component: DeviceComponent,
			},
			{
				path: 'notes',
				component: NotesComponent,
			},
		],
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
		MatTabsModule,
		MatMenuModule,
		MatToolbarModule,
		NgxEditorModule,
	],
	declarations: [
		DmViewComponent,
		AnimationLayerComponent,
		BattleTrackerComponent,
		LedStripComponent,
		LEDComponent,
		DeviceComponent,
		NotesComponent,
	],
})
export class DmModule {}
