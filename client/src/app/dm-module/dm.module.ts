import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
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
import { PlayerConfigComponent } from './player-config/player-config.component';

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
				path: 'player-config',
				component: PlayerConfigComponent,
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
		MatCardModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatSelectModule,
	],
	declarations: [
		DmViewComponent,
		AnimationLayerComponent,
		BattleTrackerComponent,
		LedStripComponent,
		LEDComponent,
		DeviceComponent,
		NotesComponent,
		PlayerConfigComponent,
	],
})
export class DmModule {}
