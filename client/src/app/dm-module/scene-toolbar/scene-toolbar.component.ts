import { Component, OnInit } from '@angular/core';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { PresentationMode, SocketEvents } from '../../../../../shared/src';

interface SceneItem {
	mode: PresentationMode;
	active: boolean;
	/**
	 * Font Awesome Icon Name
	 * See https://fontawesome.com/search?o=r&m=free
	 */
	icon: string;
	title: string;
}

@Component({
	selector: 'app-scene-toolbar',
	templateUrl: './scene-toolbar.component.html',
	styleUrls: ['./scene-toolbar.component.scss'],
})
export class SceneToolbarComponent implements OnInit {
	activeScene: PresentationMode | undefined;

	items: SceneItem[] = [
		{
			mode: PresentationMode.Initiative,
			active: false,
			icon: 'orange fa-brands fa-battle-net',
			title: 'Shows the Initiative Tracker on the client app',
		},
		{
			mode: PresentationMode.Offline,
			active: false,
			icon: 'black fa-solid fa-power-off',
			title: 'Go offline on the client app',
		},
		{
			mode: PresentationMode.FireScene,
			active: false,
			icon: 'red fa-solid fa-fire',
			title: 'Shows a fire scene on the client app',
		},
		{
			mode: PresentationMode.Timer,
			active: false,
			icon: 'blue fa-solid fa-hourglass-end',
			title: 'Starts a timer (for a break) on the client app',
		},
	];

	constructor(private socketService: SocketServiceService) {
		this.socketService
			.fromEvent(SocketEvents.SceneChanged)
			.subscribe((mode: any) => {
				console.log('mode :>> ', mode);
				this.activeScene = mode;
			});

		this.socketService.send(SocketEvents.RefreshScene, undefined);
	}

	ngOnInit(): void {}

	setScene(sceneItem: SceneItem) {
		this.socketService.send(SocketEvents.SetScene, sceneItem.mode);
	}
}
