import { Component, OnInit } from '@angular/core';
import { ElectroDmConfig, PresentationMode } from '../../../../../shared/src';

@Component({
	selector: 'app-scene-manager',
	templateUrl: './scene-manager.component.html',
	styleUrls: ['./scene-manager.component.scss'],
})
export class SceneManagerComponent implements OnInit {
	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	get serverUrl(): string {
		return ElectroDmConfig.apiUrl;
	}

	constructor() {}

	ngOnInit(): void {}

	async goToInitiative() {
		await fetch(
			`${this.serverUrl}/setScene?scene=${PresentationMode.Initiative}`
		);
	}

	async goToTimer() {
		await fetch(
			`${this.serverUrl}/setScene?scene=${PresentationMode.Timer}`
		);
	}

	async goToFire() {
		await fetch(
			`${this.serverUrl}/setScene?scene=${PresentationMode.FireScene}`
		);
	}

	async addFiveMins() {
		await fetch(`${this.serverUrl}/addTime?time=300000`);
	}

	async stopTimer() {
		await fetch(`${this.serverUrl}/addTime?time=-999999999`);
	}

	async goOffline() {
		await fetch(
			`${this.serverUrl}/setScene?scene=${PresentationMode.Offline}`
		);
	}
}
