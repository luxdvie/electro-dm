import { Component, Input, OnInit } from "@angular/core";
import { Led } from '../models/Led';

@Component({
	selector: "app-led-strip",
	templateUrl: "./led-strip.component.html",
	styleUrls: ["./led-strip.component.scss"],
})
export class LedStripComponent implements OnInit {
	@Input() leds!: Led[];
	constructor() {}

	ngOnInit(): void {}
}
