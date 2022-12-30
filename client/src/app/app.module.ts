import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgxEditorModule } from 'ngx-editor';
import { AppComponent } from './app.component';

const routes: Routes = [
	{
		path: 'dm',
		loadChildren: () =>
			import('./dm-module/dm.module').then((m) => m.DmModule),
	},
	{
		path: '',
		loadChildren: () =>
			import('./presentation-module/presentation.module').then(
				(m) => m.PresentationModule
			),
	},
];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		BrowserAnimationsModule,
		OverlayModule,
		RouterModule.forRoot(routes),
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatTabsModule,
		MatMenuModule,
		MatToolbarModule,
		NgxEditorModule,
		MatOptionModule,
		MatCardModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
