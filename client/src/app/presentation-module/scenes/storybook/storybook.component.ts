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
			header: `Welcome to the game, bitches.`,
			image: null,
			footer: null,
		},
		{
			header: `The Known Universe`,
			image: '/assets/universe-top.png?1=1',
			footer: null,
		},
		{
			header: 'Your mission...should you choose to accept it...',
			image: null,
			footer: null,
		},
		{
			header: 'Infiltrate the base...',
			image: '/assets/sigma-1.png',
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
					} else {
						this.direction = TurnDirection.Right;
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

	private swipeCoord: [number, number] = [0, 0];
	private swipeTime: number = 0;
	swipe(e: TouchEvent, when: string): void {
		const coord: [number, number] = [
			e.changedTouches[0].clientX,
			e.changedTouches[0].clientY,
		];
		const time = new Date().getTime();

		if (when === 'start') {
			this.swipeCoord = coord;
			this.swipeTime = time;
		} else if (when === 'end') {
			const direction = [
				coord[0] - this.swipeCoord[0],
				coord[1] - this.swipeCoord[1],
			];
			const duration = time - this.swipeTime;

			if (
				duration < 1000 && //
				Math.abs(direction[0]) > 30 && // Long enough
				Math.abs(direction[0]) > Math.abs(direction[1] * 3)
			) {
				// Horizontal enough
				const swipe = direction[0] < 0 ? 'next' : 'previous';
				if (swipe == 'next') {
					this.socketService.send(
						SocketEvents.NextStoryPage,
						undefined
					);
				} else {
					this.socketService.send(
						SocketEvents.PreviousStoryPage,
						undefined
					);
				}
			}
		}
	}
}
