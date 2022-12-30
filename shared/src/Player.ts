import { v4 as uuid } from 'uuid';
import { PlayerClass, PlayerRace } from './PlayerClass';

export enum Condition {
	Paralyzed = 'Paralyzed',
	Asleep = 'Asleep',
	Poisoned = 'Poisoned',
	Normal = 'Normal',
	Concentration = 'Concentration',
}

export enum PlayerType {
	Player = 'Player',
	DM = 'DM',
}

export class Player {
	// Editable Properties
	name: string | null = null;
	seat: number | null = null;
	image: string | null = 'unknown.png';
	bannerImage: string | null = null;
	race: PlayerRace = PlayerRace.Human;
	playerClass: PlayerClass = PlayerClass.Monk;
	link: string | null = null;
	dmNotes: string | null = null;

	initiative: number = 0;
	playerType: PlayerType = PlayerType.Player;
	backgroundOffset: number = 0;
	id: string | null = null;

	static makePlayer(playerInfo: Partial<Player>): Player {
		const player = new Player();
		Object.assign(player, playerInfo);

		return Player.addMissingInfo(player);
	}

	private static addMissingInfo(player: Player): Player {
		player.id = player.id || uuid();
		player.image = player.image || 'unknown.png';
		return player;
	}

	static fromJSON(playerJson: string) {
		const playerLike = JSON.parse(playerJson);
		const player = new Player();
		Object.assign(player, playerLike);

		return Player.addMissingInfo(player);
	}

	private constructor() {}

	setInitiative(value: number) {
		this.initiative = value;
	}

	reset() {
		this.setInitiative(0);
	}
}
