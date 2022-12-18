import { Component, Input, OnInit } from "@angular/core";
import { AnimationLayer } from '../models/AnimationLayer';

@Component({
	selector: "app-animation-layer",
	templateUrl: "./animation-layer.component.html",
	styleUrls: ["./animation-layer.component.scss"],
})
export class AnimationLayerComponent implements OnInit {
	@Input() layer!: AnimationLayer;
	@Input() numLEDs: number = 0;
	constructor() {}

	ngOnInit(): void {}
}
