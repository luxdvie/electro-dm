import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "led",
		loadChildren: () =>
			import("../app/led-module/led.module").then((m) => m.LedModule),
	},
	{
		path: "battle",
		loadChildren: () =>
			import("../app/battle-tracker-module/battle-tracker.module").then(
				(m) => m.BattleTrackerModule
			),
	},
	{
		path: "notes",
		loadChildren: () =>
			import("../app/notes-module/notes.module").then(
				(m) => m.NotesModule
			),
	},
	{
		path: "",
		redirectTo: "battle",
		pathMatch: "full",
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
