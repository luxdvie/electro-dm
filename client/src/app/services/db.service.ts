import { Injectable } from '@angular/core';
import { Player } from '../../../../shared/src';

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
