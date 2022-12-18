import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, Routes } from "@angular/router";
import { ColorPickerModule } from "ngx-color-picker";
import { NgxEditorModule } from 'ngx-editor';
import { NotesComponent } from "./notes/notes.component";

const routes: Routes = [
	{
		path: "",
		component: NotesComponent,
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
		NgxEditorModule,
	],
	declarations: [NotesComponent],
})
export class NotesModule {}
