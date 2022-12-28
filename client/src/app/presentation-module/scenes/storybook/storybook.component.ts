import { Component, OnInit } from '@angular/core';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { ElectroDmConfig, SocketEvents } from '../../../../../../shared/src';

let hasBeenLoaded: boolean = false;

enum TurnDirection {
	Left = 'Left',
	Right = 'Right',
}

interface PageContent {
	header: string | null;
	footer: string | null;
	image: string | null;
}

@Component({
	selector: 'storybook',
	templateUrl: './storybook.component.html',
	styleUrls: ['./storybook.component.scss'],
})
export class StorybookComponent implements OnInit {
	private _page: number | undefined;
	get page(): number | undefined {
		return this._page;
	}

	direction: TurnDirection = TurnDirection.Right;
	pageContent: PageContent | undefined;

	set page(value: number | undefined) {
		this._page = value;
		if (this._page === undefined) {
			this.pageContent = undefined;
		} else {
			this.pageContent = this.pages[this._page];
		}
	}

	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	// TODO: Complete 'Pages' sections and consider how to make this generic.
	pages = [
		{
			header: 'Page 0',
			image: null,
			footer: null,
		},
		{
			header: 'Page 1',
			image: null,
			footer: null,
		},
		{
			header: 'Page 2',
			image: null,
			footer: null,
		},
	];

	isTurningPage: boolean = false;
	animationTimeMs = 1000;
	pageTimer: any;
	togglePageFlip() {
		if (this.isTurningPage) return;

		window.clearTimeout(this.pageTimer);
		this.isTurningPage = true;

		this.pageTimer = window.setTimeout(() => {
			this.isTurningPage = false;
		}, this.animationTimeMs);
	}

	showing: boolean = false;
	constructor(protected socketService: SocketServiceService) {
		this.socketService
			.fromEvent(SocketEvents.StoryPageChanged)
			.subscribe((sPage: any) => {
				const nPage = parseInt(sPage);
				if (!Number.isNaN(nPage)) {
					if (this.page === nPage) return;

					if (this.page !== undefined && this.page > nPage) {
						this.direction = TurnDirection.Left;
						console.log('turning left');
					} else {
						this.direction = TurnDirection.Right;
						console.log('turning right');
					}

					this.page = nPage;
					setTimeout(() => {
						this.togglePageFlip();
					});
				}
			});

		this.socketService.send(SocketEvents.RefreshStoryPage, undefined);
	}

	ngOnInit(): void {
		setTimeout(
			() => {
				hasBeenLoaded = true;
				this.showing = true;
			},
			hasBeenLoaded ? 50 : 0
		);
	}
}
