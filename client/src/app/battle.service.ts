import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Player, PlayerType } from "./battle-tracker-module/Player";
import { Commands, config } from "./CONFIG";
import { SocketServiceService } from "./socket-service.service";

@Injectable({
	providedIn: "root",
})
export class BattleService {
	private _currentPlayer = new BehaviorSubject<Player | undefined>(undefined);
	currentPlayer$ = this._currentPlayer.asObservable();

	private _players: Player[] = [];
	get players() {
		return this._players;
	}

	setPlayers(value: Player[], broadcast: boolean = true) {
		this._players = value;
		if (broadcast) {
			this.socketService.send("players", this._players);
		}
	}

	private _currentPlayerIndex: number | undefined;
	get currentPlayerIndex(): number | undefined {
		return this._currentPlayerIndex;
	}

	setCurrentPlayer(value: number | undefined, broadcast: boolean = true) {
		this._currentPlayerIndex = value;
		if (broadcast) {
			this.socketService.send("currentPlayerIndex", value);
		}

		if (this._currentPlayerIndex === undefined) {
			this._currentPlayer.next(undefined);
		} else {
			this._currentPlayer.next(this.players[this._currentPlayerIndex]);
		}
	}

	get currentPlayer(): Player | undefined {
		if (this.currentPlayerIndex !== undefined) {
			return this.players[this.currentPlayerIndex];
		}

		return undefined;
	}

	constructor(private socketService: SocketServiceService) {
		this.socketService
			.fromEvent("playersChanged")
			.subscribe((newPlayers: any) => {
				this.setPlayers(newPlayers as Player[], false);
			});

		this.socketService
			.fromEvent("currentPlayerIndexChanged")
			.subscribe((value: any) => {
				if (value === null || value === undefined) {
					this.setCurrentPlayer(undefined, false);
				} else {
					let iValue = parseInt((value as Object).toString());
					if (Number.isNaN(iValue)) {
						this.setCurrentPlayer(undefined, false);
					} else {
						this.setCurrentPlayer(iValue, false);
					}
				}
			});
	}

	sendCommand(command: string) {
		window.fetch(`${config.apiUrl}/send?command=${command}`);
	}

	reset() {
		this.sendCommand(Commands.Off);
		this.setPlayers(
			config.startingPlayers.map(
				(startingPlayer) =>
					new Player(
						startingPlayer.name,
						startingPlayer.seat,
						startingPlayer.image,
						PlayerType.Player
					)
			)
		);

		this.setCurrentPlayer(undefined, true);
	}

	startOrNext() {
		if (this.currentPlayerIndex === undefined) {
			this.setCurrentPlayer(-1, false);
		}

		this.setCurrentPlayer(this.currentPlayerIndex! + 1, true);
		if (this.currentPlayerIndex! >= this.players.length) {
			this.setCurrentPlayer(0, true);
		}

		// if (this.currentPlayer) {
		// 	if (this.currentPlayer.playerType === PlayerType.DM) {
		// 		this.sendCommand(Commands.ShowDM);
		// 	} else {
		// 		// Show Player N
		// 		this.sendCommand(`P${this.currentPlayer.seat + 1}`);
		// 	}
		// }
	}

	addChar() {
		const name = window.prompt("Enter character name:");
		if (name) {
			this.players.push(new Player(name, config.dmSeat, PlayerType.DM));
		}

		this.setPlayers(this.players, true);
	}

	orderPlayers() {
		this.setPlayers(
			this.players.sort((a: Player, b: Player) =>
				a.initiative > b.initiative
					? -1
					: a.initiative < b.initiative
					? 1
					: 0
			)
		);
	}
}
