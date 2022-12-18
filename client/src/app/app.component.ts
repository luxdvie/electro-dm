import { Component } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	links = ["Battle", "Notes", "Led"];

	constructor(protected router: Router) {}

	private _activeLink: string = "Battle";
	get activeLink() {
		return this._activeLink;
	}
	set activeLink(value: string) {
		if (this._activeLink != value) {
			this._activeLink = value.toLowerCase();
			this.router.navigate([this._activeLink]);
		}
	}

	background: ThemePalette = "primary";
}
