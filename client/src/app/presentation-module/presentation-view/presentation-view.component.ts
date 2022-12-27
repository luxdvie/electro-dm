import { Component, OnInit } from '@angular/core';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { PresentationMode, SocketEvents } from '../../../../../shared/src';

@Component({
	selector: 'app-presentation-view',
	templateUrl: './presentation-view.component.html',
	styleUrls: ['./presentation-view.component.scss'],
})
export class PresentationViewComponent implements OnInit {
	scene: PresentationMode = PresentationMode.Initiative;
	constructor(protected socketService: SocketServiceService) {
		this.socketService
			.fromEvent(SocketEvents.SceneChanged)
			.subscribe((mode: any) => {
				this.setScene(mode as PresentationMode, false);
			});

		this.socketService.send(SocketEvents.RefreshScene, undefined);
	}

	ngOnInit(): void {}

	setScene(scene: PresentationMode, broadcast: boolean = true) {
		this.scene = scene;

		if (broadcast) {
			this.socketService.send(SocketEvents.SetScene, this.scene);
		}
	}
}
