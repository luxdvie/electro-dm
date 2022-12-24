import { Component } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { Router } from "@angular/router";
import { ViewServiceService } from "./view-service.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	links = ["Battle", "Notes", "Order Tracker", "Led"];

	fullScreen: boolean = false;

	constructor(
		protected router: Router,
		protected viewService: ViewServiceService
	) {
		this.viewService.fullScreen$.subscribe((fullScreen) => {
			console.log('full screen changed to: ' + fullScreen);
			this.fullScreen = fullScreen;
		});
	}

	private _activeLink: string = "Battle";
	get activeLink() {
		return this._activeLink;
	}
	set activeLink(value: string) {
		if (this._activeLink != value) {
			this._activeLink = value.toLowerCase().replace(/\ /gi, "-");
			this.router.navigate([this._activeLink]);
		}
	}

	background: ThemePalette = "primary";
}
