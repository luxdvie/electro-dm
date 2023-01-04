import { v4 as uuid } from 'uuid';
import { DMBannerImages } from './DMImages';
import { ElectroDmConfig } from './ElectroDmConfig';
import { PlayerClass, PlayerRace } from './PlayerClass';
import { Roll } from './Random';

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

export class PlayerBase {
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
		const player = new PlayerBase();
		Object.assign(player, playerInfo);

		return PlayerBase.addMissingInfo(player);
	}

	protected static addMissingInfo(player: Player): Player {
		player.id = player.id || uuid();
		player.image = player.image || 'unknown.png';
		return player;
	}

	static fromJSON(playerJson: string) {
		const playerLike = JSON.parse(playerJson);
		const player = new PlayerBase();
		Object.assign(player, playerLike);

		return PlayerBase.addMissingInfo(player);
	}

	protected constructor() {}

	setInitiative(value: number) {
		this.initiative = value;
	}

	reset() {
		this.setInitiative(0);
	}

	isDm() {
		return this.playerType === PlayerType.DM;
	}

	asDm() {
		if (this.isDm()) {
			return this as unknown as DmPlayer;
		} else {
			throw 'You cannot access asDm() without first checking isDm()'
		}
	}
}

export class DmPlayer extends PlayerBase {
	health: number = 0;
	statBlock: string | null = null;

	static makeDmPlayer(from: Partial<DmPlayer>) {
		const player = new DmPlayer();
		Object.assign(player, from);
		return PlayerBase.addMissingInfo(player);
	}
}

export type Player = DmPlayer | PlayerBase;

export const Goblin = () => {
	const goblin = DmPlayer.makeDmPlayer({
		name: 'Goblin',
		statBlock: '/assets/stat-blocks/goblin.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'troll.png',
		bannerImage: DMBannerImages.Troll,
		race: PlayerRace.Goblin,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/16907-goblin',
		dmNotes: 'dm character',
		health: Roll().two().d6().value,
	});

	return goblin;
};
