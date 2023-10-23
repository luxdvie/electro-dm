import { Injectable } from '@angular/core';
import { Player, PlayerBase, PlayerType } from '../../../../shared/src';
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
				console.log('res :>> ', res);
				if (Array.isArray(res)) {
					return Promise.resolve(
						(res as Player[]).map((p) => PlayerBase.makePlayer(p))
					);
				} else {
					return Promise.reject(
						'Unexpected data type returned from JSON.parse'
					);
				}
			} else {
				return Promise.resolve([
					PlayerBase.makePlayer({
						name: 'Early Cuyler',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Fighter,
						playerType: PlayerType.Player,
						image: 'early.png',
						dmNotes: '',
						seat: 2,
					}),
					PlayerBase.makePlayer({
						name: 'Rusty Cuyler',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Rogue,
						playerType: PlayerType.Player,
						image: 'rusty.png',
						dmNotes: '',
						seat: 1,
					}),
					PlayerBase.makePlayer({
						name: 'Granny Cuyler',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Druid,
						playerType: PlayerType.Player,
						image: 'grann.png',
						dmNotes: '',
						seat: 0,
					}),
					PlayerBase.makePlayer({
						name: 'Lil Cuyler',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Bard,
						playerType: PlayerType.Player,
						image: 'lil.png',
						dmNotes: '',
						seat: 3,
					}),
					PlayerBase.makePlayer({
						name: 'Jesus',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Cleric,
						playerType: PlayerType.Player,
						image: 'jesus.png',
						dmNotes: '',
						seat: 4,
					}),
					PlayerBase.makePlayer({
						name: 'Plumber Bubba',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Barbarian,
						playerType: PlayerType.Player,
						image: 'bubba.png',
						dmNotes: '',
						seat: 4,
					}),
					PlayerBase.makePlayer({
						name: 'Krystal',
						race: PlayerRace.Human,
						playerClass: PlayerClass.Fighter,
						playerType: PlayerType.Player,
						image: 'krystal.png',
						dmNotes: '',
						seat: 4,
					}),
				]);
			}
		} catch (err) {
			return Promise.reject('Unable to load player data');
		}
	}

	savePlayers(players: Player[]) {
		localStorage.setItem(PlayersLocalStorageKey, JSON.stringify(players));
	}
}
