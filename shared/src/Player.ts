import { v4 as uuid } from 'uuid';
import { DMBannerImages } from './DMImages';
import { ElectroDmConfig } from './ElectroDmConfig';
import { PlayerClass, PlayerRace } from './PlayerClass';
import { Roll } from './Random';

export enum LifeState {
	Living = 'Living',
	Dying = 'Dying',
	Dead = 'Dead',
}

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
	maxHp: number = 0;
	health: number = 0;
	lifeState: LifeState = LifeState.Living;

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
			throw 'You cannot access asDm() without first checking isDm()';
		}
	}

	applyDamage(value: number) {
		this.health -= value;

		if (this.health <= 0) {
			this.health = 0;
			if (this.playerType === PlayerType.DM) {
				this.die();
			} else {
				this.startDying();
			}
		}
	}

	applyHeal(value: number) {
		this.health += value;
		this.health = Math.min(this.health, this.maxHp);

		if (this.lifeState === LifeState.Dying) {
			this.stopDying();
		} else if (this.lifeState === LifeState.Dead && this.isDm()) {
			this.stopDying();
		}
	}

	deathRolls: number = 0;
	deathSaves: number = 0;
	startDying() {
		this.lifeState = LifeState.Dying;
	}

	stopDying() {
		this.deathRolls = 0;
		this.deathSaves = 0;
		this.lifeState = LifeState.Living;
	}

	die() {
		this.lifeState = LifeState.Dead;
	}

	makeDeathRoll() {
		if (this.lifeState !== LifeState.Dying) return;

		const amt = Roll().one().d20().value;
		if (amt >= 10) {
			this.deathSaves += 1;
		} else {
			this.deathRolls += 1;
		}

		if (this.deathSaves >= 3) {
			this.stopDying();
		} else if (this.deathRolls >= 3) {
			this.die();
		}
	}

	equals(player: Player): boolean {
		const aPlayer: any = player as any;
		const aThis: any = this as any;

		let same: boolean = true;
		for (const key in aThis as Player) {
			if (typeof aPlayer[key] !== 'function' && aPlayer[key]) {
				if (!aPlayer[key] !== aThis[key]) {
					same = false;
					break;
				}
			}
		}
		return false;
	}
}

export class DmPlayer extends PlayerBase {
	statBlock: string | null = null;

	static makeDmPlayer(from: Partial<DmPlayer>) {
		const player = new DmPlayer();
		Object.assign(player, from);
		return PlayerBase.addMissingInfo(player);
	}
}

export type Player = DmPlayer | PlayerBase;

export const Goblin = () => {
	const hp = Roll().two().d6().value;

	return DmPlayer.makeDmPlayer({
		name: 'Goblin',
		statBlock: '/assets/stat-blocks/goblin.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'troll.png',
		bannerImage: DMBannerImages.Goblin,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/16907-goblin',
		dmNotes: 'dm character',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value
	});
};

export const Nightwalker = () => {
	const hp = Roll().nine().d8().value + 18;

	return DmPlayer.makeDmPlayer({
		name: 'Nightwalker',
		statBlock: '/assets/stat-blocks/bodak.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'unknown.png',
		bannerImage: DMBannerImages.Nightwalker,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/2560744-bodak',
		dmNotes: 'nightwalker stat replacement',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value
	});
};

export const Rohan = () => {
	const hp = Roll().nine().d12().value + 30;

	return DmPlayer.makeDmPlayer({
		name: 'Rohan',
		statBlock: '/assets/stat-blocks/rohan.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'rohan.png',
		bannerImage: DMBannerImages.Orc,
		race: PlayerRace.HalfOrc,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/2821170-githyanki-buccaneer',
		dmNotes: 'Rohan carries an greatsword!',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value
	});
};

export const EngineerDevi = () => {
	const hp = Roll().four().d12().value + 20;

	return DmPlayer.makeDmPlayer({
		name: 'Engineer Devi',
		statBlock: '/assets/stat-blocks/engineer-devi.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'engineer-devi.png',
		bannerImage: DMBannerImages.Lizard,
		race: PlayerRace.Lizardfolk,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/16946-lizardfolk',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value
	});
};

export const Tiefling = (customName?: string) => {
	const hp = Roll().seven().d8().value + 33;

	return DmPlayer.makeDmPlayer({
		name: customName || 'Tiefling',
		statBlock: '/assets/stat-blocks/tiefling.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'tiefling.png',
		bannerImage: DMBannerImages.Tiefling,
		race: PlayerRace.Tiefling,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/17137-cambion',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value
	});
};

export const Dragonborn = () => {
	const hp = Roll().four().d8().value + 20;

	return DmPlayer.makeDmPlayer({
		name: 'Dragonborn',
		statBlock: '/assets/stat-blocks/dragonborn.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'dragonborn.png',
		bannerImage: DMBannerImages.Dragonborn,
		race: PlayerRace.Dragornborn,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.aidedd.org/dnd/monstres.php?vo=half-red-dragon-veteran',
		dmNotes: 'Will play him at much lower CR',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value
	});
};
