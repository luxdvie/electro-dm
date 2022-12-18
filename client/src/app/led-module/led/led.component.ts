import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ColorPickerDirective } from "ngx-color-picker";
import { Led } from "../models/Led";

@Component({
	selector: "app-led",
	templateUrl: "./led.component.html",
	styleUrls: ["./led.component.scss"],
})
export class LEDComponent implements OnInit {
	@Input() led!: Led;
	@ViewChild(ColorPickerDirective) colorPicker!: ColorPickerDirective;
	disablePicker: boolean = true;
	isPickingColor: boolean = false;

	get color() {
		return this.led.color;
	}

	set color(value: string) {
		this.led.color = value;
	}

	constructor() {}

	ngOnInit(): void {}

	ngAfterViewInit() {
		this.colorPicker.colorPickerClose.subscribe(() => {
			this.disablePicker = true;
		});
	}

	onDoubleClick(): void {
		this.disablePicker = false;
		this.colorPicker.openDialog();
	}
}
