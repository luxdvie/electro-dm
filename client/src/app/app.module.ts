import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
	{
		path: 'dm',
		pathMatch: 'prefix',
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
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
