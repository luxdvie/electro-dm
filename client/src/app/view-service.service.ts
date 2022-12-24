import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ViewServiceService {
	private _fullScreen = new BehaviorSubject(false);
	fullScreen$ = this._fullScreen.asObservable();
	constructor() {}

	setFullScreen(value: boolean) {
		this._fullScreen.next(value);
	}
}
