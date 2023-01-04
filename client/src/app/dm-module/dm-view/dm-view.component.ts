import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { ViewServiceService } from 'src/app/services/view-service.service';

@Component({
	selector: 'app-dm-view',
	templateUrl: './dm-view.component.html',
	styleUrls: ['./dm-view.component.scss'],
})
export class DmViewComponent implements OnInit {
	links = [
		{
			label: 'Encounter Builder',
			route: '/dm/battle',
		},
		{
			label: 'Notes',
			route: '/dm/notes',
		},
		{
			label: 'Player Config',
			route: '/dm/player-config',
		},
		{
			label: 'Scene Manager',
			route: '/dm/scene-manager',
		},
		{
			label: 'Help',
			route: '/dm/welcome',
		},
		{
			label: 'Campaign Tools',
			route: '/dm/tools',
		},
		// {
		// 	label: 'LED Builder (Nonfunctional)',
		// 	route: '/dm/led',
		// },
	];

	fullScreen: boolean = false;

	constructor(
		protected router: Router,
		protected viewService: ViewServiceService
	) {
		this.viewService.fullScreen$.subscribe((fullScreen) => {
			this.fullScreen = fullScreen;
		});

		if (this.router.url) {
			const matchingLink = this.links.find(
				(l) => l.route === this.router.url
			);

			if (matchingLink) {
				this.activeLabel = matchingLink.label;
			}
		}
	}

	ngOnInit(): void {}

	private _activeLabel: string = '';
	get activeLabel() {
		return this._activeLabel;
	}
	set activeLabel(value: string) {
		if (this._activeLabel != value) {
			const e = this.links.find((l) => l.label === value);
			if (e) {
				this._activeLabel = e.label;
				this.router.navigate([e.route]);
			}
		}
	}

	background: ThemePalette = 'primary';
}
