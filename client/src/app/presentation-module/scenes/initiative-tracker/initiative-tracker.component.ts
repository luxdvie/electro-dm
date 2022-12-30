import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	QueryList,
	ViewChildren
} from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { ViewServiceService } from 'src/app/services/view-service.service';
import {
	ElectroDmConfig,
	Player,
	PlayerType,
	SocketEvents
} from '../../../../../../shared/src';

@Component({
	selector: 'initiative-tracker',
	templateUrl: './initiative-tracker.component.html',
	styleUrls: ['./initiative-tracker.component.scss'],
})
export class InitiativeTrackerComponent implements OnInit {
	@ViewChildren('rowGraphic') graphics!: QueryList<ElementRef>;

	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	showDM: boolean = false;
	currentPlayer: Player | undefined;

	leftPaddingNumber: number = 200;
	leftPaddingName: number = 200;
	numWidth: number = 100;
	nameWidth: number = 150;
	fontSize: number = 83;

	players: Player[] = [];
	allPlayers: Player[] = [];
	nextPlayerName: string | undefined | null;
	rowHeight: number = 50;
	get numPlayers() {
		return this.players.length;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		setTimeout(() => {
			this.handleResize();
		}, 10);
	}

	@HostListener('window:orientationchange', ['$event'])
	onOrientationChange(event: Event) {
		setTimeout(() => {
			this.handleResize();
		}, 10);
	}

	constructor(
		protected viewService: ViewServiceService,
		protected battleService: BattleService,
		protected socketService: SocketServiceService,
		private elementRef: ElementRef
	) {
		this.battleService.currentPlayer$.subscribe((player) => {
			this.currentPlayer = player;
			this.showDM = this.currentPlayer?.playerType === PlayerType.DM;
		});

		this.battleService.nextPlayerName$.subscribe(
			(nextName: string | undefined | null) => {
				this.nextPlayerName = nextName;
			}
		);

		this.socketService
			.fromEvent(SocketEvents.PlayersChanged)
			.subscribe((newPlayers: any) => {
				this.allPlayers = newPlayers as Player[];
				this.players = this.allPlayers.filter(
					(p) => p.playerType === PlayerType.Player
				);

				if (this.currentPlayer) {
					const id = this.currentPlayer.id;
					const existingPlayer = this.allPlayers.find(p => p.id === id);
					if (existingPlayer) {
						this.currentPlayer = existingPlayer; // to force re-render
					}

				}

				this.handleResize();
			});

		this.socketService.send(SocketEvents.RefreshPlayers, undefined);
	}

	private handleResize() {
		this.rowHeight =
			Math.floor(window.innerHeight / this.players.length) - 20;

		this.elementRef.nativeElement.style.setProperty(
			'--rowHeight',
			`${this.rowHeight}px`
		);

		setTimeout(() => {
			this.repositionElements();
		}, 10);
	}

	showing: boolean = false;
	ngOnInit(): void {
		setTimeout(() => {
			this.showing = true;
		}, 0);

		setTimeout(() => {
			this.viewService.setFullScreen(true);
		});
	}

	repositionElements = () => {
		const graphic = this.graphics.get(0)?.nativeElement;
		if (!graphic) return;

		const box = (graphic as HTMLElement).getBoundingClientRect();

		// Badge is ~17% of shape
		this.numWidth = box.width * 0.172;
		this.fontSize = Math.floor(box.height / 2);

		const gap = this.numWidth * 1.1;
		this.leftPaddingNumber = box.x;
		this.leftPaddingName = this.leftPaddingNumber + gap;
		this.nameWidth = box.width - this.numWidth - gap;
	};
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
