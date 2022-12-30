import { Component } from '@angular/core';
import { ElectroDmConfig, SERVER_PORT } from '../../../shared/src';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent {
	constructor() {}
	ready = false;

	async ngOnInit() {
		//
		// This step is performed to synchronize the ElectroDmConfig values
		// from the server to the client. In the future, we should store the
		// config in a database and retrieve it from a database to avoid this
		// weirdness.
		//

		const res = await fetch(
			`http://${window.location.host.split(':')[0]}:${SERVER_PORT}/config`
		);
		const config = await res.json();

		ElectroDmConfig.setIpAddress(config.ip);
		Object.keys(config).forEach((key) => {
			if (key !== 'setIpAddress') {
				(ElectroDmConfig as any)[key] = config[key];
			}
		});

		this.ready = true;
	}
}
