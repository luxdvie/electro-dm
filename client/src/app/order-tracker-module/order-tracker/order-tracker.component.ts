import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	QueryList,
	ViewChildren
} from "@angular/core";
import { Player, PlayerType } from "src/app/battle-tracker-module/Player";
import { BattleService } from "src/app/battle.service";
import { SocketServiceService } from "src/app/socket-service.service";
import { ViewServiceService } from "src/app/view-service.service";

@Component({
	selector: "app-order-tracker",
	templateUrl: "./order-tracker.component.html",
	styleUrls: ["./order-tracker.component.scss"],
})
export class OrderTrackerComponent implements OnInit {
	@ViewChildren("rowGraphic") graphics!: QueryList<ElementRef>;

	showDM: boolean = false;
	currentPlayer: Player | undefined;

	leftPaddingNumber: number = 200;
	leftPaddingName: number = 200;
	numWidth: number = 100;
	nameWidth: number = 150;
	fontSize: number = 83;

	players: Player[] = [];
	allPlayers: Player[] = [];
	nextPlayerName: string | undefined;
	rowHeight: number = 50;
	get numPlayers() {
		return this.players.length;
	}

	@HostListener("window:resize", ["$event"])
	onResize(event: Event) {
		setTimeout(() => {
			this.handleResize();
		}, 10);
	}

	@HostListener("window:orientationchange", ["$event"])
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
			this.nextPlayerName = undefined;

			this.currentPlayer = player;
			this.showDM = this.currentPlayer?.playerType === PlayerType.DM;

			if (this.currentPlayer) {
				let nextUpIndex = this.battleService.currentPlayerIndex! + 1;
				if (nextUpIndex >= this.allPlayers.length) {
					nextUpIndex = 0;
				}

				const nextPlayer = this.allPlayers[nextUpIndex];
				if (nextPlayer.playerType === PlayerType.DM) {
					this.nextPlayerName = "DM!";
				} else {
					this.nextPlayerName = nextPlayer.name;
				}
			}
		});

		this.socketService
			.fromEvent("playersChanged")
			.subscribe((newPlayers: any) => {
				this.allPlayers = newPlayers as Player[];
				this.players = this.allPlayers.filter(
					(p) => p.playerType === PlayerType.Player
				);

				this.handleResize();
			});

		this.socketService.send("refreshPlayers", () => {});
	}

	private handleResize() {
		this.rowHeight =
			Math.floor(window.innerHeight / this.players.length) - 20;

		this.elementRef.nativeElement.style.setProperty(
			"--rowHeight",
			`${this.rowHeight}px`
		);

		setTimeout(() => {
			this.repositionElements();
		}, 10);
	}

	ngOnInit(): void {
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

		const gap = this.numWidth * 1.15;
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
