import { Injectable } from '@angular/core';
import { Player, PlayerType } from '../../../../shared/src';
import { PlayerClass, PlayerRace } from '../../../../shared/src/PlayerClass';

export const PlayersLocalStorageKey = 'players';

@Injectable({
	providedIn: 'root',
})
export class DBService {
	constructor() {}

	async getPlayers(): Promise<Player[]> {
		try {
			const playerJson = localStorage.getItem(PlayersLocalStorageKey);
			if (playerJson) {
				const res = JSON.parse(playerJson);
				if (Array.isArray(res)) {
					return Promise.resolve(res as Player[]);
				} else {
					return Promise.reject(
						'Unexpected data type returned from JSON.parse'
					);
				}
			} else {
				return Promise.resolve([
					Player.makePlayer({
						name: 'Default Player 1',
						race: PlayerRace.Aarakocra,
						playerClass: PlayerClass.Artificer,
						playerType: PlayerType.Player,
						image: 'unknown.png',
						dmNotes: 'Sample DM notes...'
					}),
					Player.makePlayer({
						name: 'Default Player 2',
						race: PlayerRace.FireGenasi,
						playerClass: PlayerClass.Fighter,
						playerType: PlayerType.Player,
						image: 'unknown.png',
						dmNotes: 'Sample DM notes...'
					})
				]);
			}
		} catch (err) {
			return Promise.reject('Unable to load player data');
		}

		return Promise.resolve([]);
	}

	savePlayers(players: Player[]) {
		localStorage.setItem(PlayersLocalStorageKey, JSON.stringify(players));
	}
}
