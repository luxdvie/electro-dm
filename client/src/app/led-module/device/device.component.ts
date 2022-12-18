import { Component, OnInit } from "@angular/core";
import { AnimationLayer } from "../models/AnimationLayer";
import { Led } from "../models/Led";

@Component({
	selector: "app-device",
	templateUrl: "./device.component.html",
	styleUrls: ["./device.component.scss"],
})
export class DeviceComponent implements OnInit {
	currentFrame: number = 1;
	numLEDs: number = 50;
	loading: boolean = true;
	layers: AnimationLayer[] = [];

	constructor() {}

	async ngOnInit(): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const layers = [
			{
				name: "layer1",
				leds: [
					{
						color: "blue",
						index: 0,
					},
					{
						color: "blue",
						index: 1,
					},
				],
			},
			{
				name: "layer2",
				leds: [
					{
						color: "green",
						index: 0,
					},
					{
						color: "red",
						index: 3,
					},
				],
			},
		];

		this.resizeLedArrays(layers);
		this.layers = layers;
	}

	private resizeLedArrays(layers: AnimationLayer[]) {
		layers.forEach((layer) => {
			const missingLeds = Array(this.numLEDs).fill(1).map(
				(entry, index) => index
			);

			layer.leds.forEach((led) => {
				delete missingLeds[led.index];
			});

			missingLeds.forEach((entry) => {
				layer.leds.push({
					color: "",
					index: entry,
				});
			});

			layer.leds.sort((a: Led, b: Led) =>
				a.index < b.index ? -1 : a.index > b.index ? 1 : 0
			);
		});
	}

	goToFrame(frame: number) {
		if (frame <= 1) {
			this.currentFrame = 1;
		} else {
			this.currentFrame = frame;
		}
	}
}
