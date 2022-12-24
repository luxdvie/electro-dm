import { Component, OnInit } from "@angular/core";
import { BattleService } from "src/app/battle.service";
import { SocketServiceService } from "src/app/socket-service.service";

@Component({
	selector: "app-battle-tracker",
	templateUrl: "./battle-tracker.component.html",
	styleUrls: ["./battle-tracker.component.scss"],
})
export class BattleTrackerComponent implements OnInit {
	get players() {
		return this.battleService.players;
	}

	get currentPlayerIndex() {
		return this.battleService.currentPlayerIndex;
	}

	constructor(
		protected battleService: BattleService,
		private socketService: SocketServiceService
	) {}

	ngOnInit(): void {}

	selectOnFocus(ev: FocusEvent) {
		if (ev && ev.currentTarget) {
			(ev.currentTarget as HTMLInputElement).select();
		}
	}

	orderPlayers() {
		this.battleService.orderPlayers();
	}

	reset() {
		this.battleService.reset();
	}

	startOrNext() {
		this.battleService.startOrNext();
	}

	addChar() {
		this.battleService.addChar();
	}
}
