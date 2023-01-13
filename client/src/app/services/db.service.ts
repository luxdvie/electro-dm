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
						name: 'Drip',
						race: PlayerRace.Plasmoid,
						playerClass: PlayerClass.Fighter,
						playerType: PlayerType.Player,
						image: 'drip.jpeg',
						dmNotes: 'Sleuth, slime into pipes and shit.',
						seat: 2,
					}),
					PlayerBase.makePlayer({
						name: 'Cassandra Ravage',
						race: PlayerRace.Bugbear,
						playerClass: PlayerClass.Barbarian,
						playerType: PlayerType.Player,
						image: 'tyler.jpeg',
						dmNotes: 'Haymakers! WWE',
						seat: 1,
					}),
					PlayerBase.makePlayer({
						name: 'Hevesta Ironarm',
						race: PlayerRace.Kender,
						playerClass: PlayerClass.Cleric,
						playerType: PlayerType.Player,
						image: 'frances.jpeg',
						dmNotes:
							'Iron arm.. put it into the Hyperium reactor. Break Dr Bhaskar out of jail?',
						seat: 0,
					}),
					PlayerBase.makePlayer({
						name: 'Angelica',
						race: PlayerRace.Fairy,
						playerClass: PlayerClass.Sorcerer,
						playerType: PlayerType.Player,
						image: 'bryan.jpeg',
						dmNotes: 'Angel',
						seat: 3,
					}),
					PlayerBase.makePlayer({
						name: 'Cornelius Hammerbottom Jr.',
						race: PlayerRace.RockGnome,
						playerClass: PlayerClass.Artificer,
						playerType: PlayerType.Player,
						image: 'unknown.png',
						dmNotes: 'steel companion... make shit... use strategium!',
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
