import { Component, OnInit } from "@angular/core";
import { Commands, config } from "../../CONFIG";
import { Player, PlayerType } from "../Player";

@Component({
	selector: "app-battle-tracker",
	templateUrl: "./battle-tracker.component.html",
	styleUrls: ["./battle-tracker.component.scss"],
})
export class BattleTrackerComponent implements OnInit {
	players: Player[] = [];
	currentPlayerIndex: number | undefined;

	get currentPlayer(): Player | undefined {
		if (this.currentPlayerIndex !== undefined) {
			return this.players[this.currentPlayerIndex];
		}

		return undefined;
	}

	constructor() {}

	ngOnInit(): void {
		this.reset();
	}

	sendCommand(command: string) {
		window.fetch(`${config.apiUrl}/send?command=${command}`);
	}

	reset() {
		this.sendCommand(Commands.Off);
		this.players = config.startingPlayers.map(
			(startingPlayer) =>
				new Player(
					startingPlayer.name,
					startingPlayer.seat,
					startingPlayer.image,
					PlayerType.Player
				)
		);
		this.currentPlayerIndex = undefined;
	}

	startOrNext() {
		if (this.currentPlayerIndex === undefined) {
			this.currentPlayerIndex = -1;
		}

		this.currentPlayerIndex++;
		if (this.currentPlayerIndex >= this.players.length) {
			this.currentPlayerIndex = 0;
		}

		if (this.currentPlayer) {
			if (this.currentPlayer.playerType === PlayerType.DM) {
				this.sendCommand(Commands.ShowDM);
			} else {
				// Show Player N
				this.sendCommand(
					`P${this.players[this.currentPlayerIndex].seat + 1}`
				);
			}
		}
	}

	addChar() {
		const name = window.prompt("Enter character name:");
		if (name) {
			this.players.push(new Player(name, config.dmSeat, PlayerType.DM));
		}
	}

	orderPlayers() {
		this.players = this.players.sort((a: Player, b: Player) =>
			a.initiative > b.initiative
				? -1
				: a.initiative < b.initiative
				? 1
				: 0
		);
	}

	selectOnFocus(ev: FocusEvent) {
		if (ev && ev.currentTarget) {
			(ev.currentTarget as HTMLInputElement).select();
		}
	}
}
