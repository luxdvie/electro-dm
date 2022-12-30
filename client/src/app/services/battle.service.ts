import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
	Commands,
	ElectroDmConfig,
	Player,
	PlayerType,
	SocketEvents
} from '../../../../shared/src';
import { DBService } from './db.service';
import { SocketServiceService } from './socket-service.service';

@Injectable({
	providedIn: 'root',
})
export class BattleService {
	private _currentPlayer = new BehaviorSubject<Player | undefined>(undefined);
	currentPlayer$ = this._currentPlayer.asObservable();

	private _nextPlayerName = new BehaviorSubject<string | undefined | null>(
		undefined
	);
	nextPlayerName$ = this._nextPlayerName.asObservable();

	private _players: Player[] = [];
	get players() {
		return this._players;
	}

	setPlayers(value: Player[], broadcast: boolean = true) {
		this._players = value;
		if (broadcast) {
			this.socketService.send('players', this._players);
		}
	}

	private _currentPlayerIndex: number | undefined;
	get currentPlayerIndex(): number | undefined {
		return this._currentPlayerIndex;
	}

	setCurrentPlayer(value: number | undefined, broadcast: boolean = true) {
		this._currentPlayerIndex = value;
		if (broadcast) {
			this.socketService.send(
				SocketEvents.CurrentPlayerIndexReceived,
				value
			);
		}

		if (this._currentPlayerIndex === undefined) {
			this._currentPlayer.next(undefined);
			this._nextPlayerName.next(undefined);
			this._battleActive.next(false);
		} else {
			this._battleActive.next(true);
			const thisPlayer = this.players[this._currentPlayerIndex];
			this._currentPlayer.next(thisPlayer);

			if (thisPlayer) {
				let nextUpIndex = this._currentPlayerIndex + 1;
				if (nextUpIndex >= this.players.length) {
					nextUpIndex = 0;
				}

				const nextPlayer = this.players[nextUpIndex];
				if (!nextPlayer) {
					this._nextPlayerName.next(undefined);
					return;
				}

				if (nextPlayer.playerType === PlayerType.DM) {
					this._nextPlayerName.next('DM!');
				} else {
					this._nextPlayerName.next(nextPlayer.name);
				}
			} else {
				this._nextPlayerName.next(undefined);
			}
		}
	}

	get currentPlayer(): Player | undefined {
		if (this.currentPlayerIndex !== undefined) {
			return this.players[this.currentPlayerIndex];
		}

		return undefined;
	}

	constructor(
		private socketService: SocketServiceService,
		private dbService: DBService
	) {
		this.socketService
			.fromEvent(SocketEvents.PlayersChanged)
			.subscribe((newPlayers: any) => {
				this.setPlayers(newPlayers as Player[], false);
			});

		this.socketService
			.fromEvent(SocketEvents.PlayerIndexChanged)
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
		window.fetch(`${ElectroDmConfig.apiUrl}/send?command=${command}`);
	}

	async reset(): Promise<void> {
		const players = await this.dbService.getPlayers();

		this.socketService.send(SocketEvents.ConfigureServer, {
			numLEDs: ElectroDmConfig.numLEDs,
			numPlayers: players.length,
		});

		this.sendCommand(Commands.Off);
		this.setPlayers(players);
		this.setCurrentPlayer(undefined, true);
		this._battleActive.next(false);
	}

	private _battleActive = new BehaviorSubject(false);
	battleActive$ = this._battleActive.asObservable();

	startOrNext() {
		setTimeout(() => {
			if (this.currentPlayerIndex === undefined) {
				this.setCurrentPlayer(-1, false);
			}

			this.setCurrentPlayer(this.currentPlayerIndex! + 1, true);
			if (this.currentPlayerIndex! >= this.players.length) {
				this.setCurrentPlayer(0, true);
				this._battleActive.next(true);
			} else {
				this._battleActive.next(false);
			}
		}, 50);
	}

	addChar(player: Player) {
		this.players.push(player);
		this.setPlayers(this.players, true);
	}

	orderPlayers() {
		this.setPlayers(this.players.sort(BattleService.sortByInit));
	}

	static sortByInit = (a: Player, b: Player) => {
		return a.initiative > b.initiative
			? -1
			: a.initiative < b.initiative
			? 1
			: 0;
	};
}
