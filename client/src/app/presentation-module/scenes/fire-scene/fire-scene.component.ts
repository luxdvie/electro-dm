import { Component, OnInit } from '@angular/core';
import { ElectroDmConfig } from '../../../../../../shared/src';

@Component({
	selector: 'fire-scene',
	templateUrl: './fire-scene.component.html',
	styleUrls: ['./fire-scene.component.scss'],
})
export class FireSceneComponent implements OnInit {
	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	constructor() {}
	showing: boolean = false;
	ngOnInit(): void {
		setTimeout(() => {
			this.showing = true;
		}, 1000);
	}
}
