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
	links = ['Battle', 'Notes', 'Player Config', 'Led'];

	fullScreen: boolean = false;

	constructor(
		protected router: Router,
		protected viewService: ViewServiceService
	) {
		this.viewService.fullScreen$.subscribe((fullScreen) => {
			this.fullScreen = fullScreen;
		});
	}

	ngOnInit(): void {}

	private _activeLink: string = 'Battle';
	get activeLink() {
		return this._activeLink;
	}
	set activeLink(value: string) {
		if (this._activeLink != value) {
			this._activeLink = value.toLowerCase().replace(/\ /gi, '-');
			this.router.navigate(['dm/' + this._activeLink]);
		}
	}

	background: ThemePalette = 'primary';
}
