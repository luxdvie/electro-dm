import { Component, OnInit } from "@angular/core";
import { Editor } from "ngx-editor";

const htmlKey = "ElectroDmHTML";

@Component({
	selector: "app-notes",
	templateUrl: "./notes.component.html",
	styleUrls: ["./notes.component.scss"],
})
export class NotesComponent implements OnInit {
	editor!: Editor;
	private _html: string = window.localStorage.getItem(htmlKey) || "";
	get html(): string {
		return this._html;
	}

	set html(value: string) {
		window.localStorage.setItem(htmlKey, value);
		this._html = value;
	}

	constructor() {}

	ngOnInit(): void {
		this.editor = new Editor();
	}

	ngOnDestroy(): void {
		this.editor.destroy();
	}

	onChange() {
		console.log("here");
	}
}
