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
	Frightened = 'Frightened',
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
	const hp = Roll().five().d6().value;

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
		initiative: Roll().d20().value,
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
		initiative: Roll().d20().value,
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
		initiative: Roll().d20().value,
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
		initiative: Roll().d20().value,
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
		initiative: Roll().d20().value,
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
		initiative: Roll().d20().value,
	});
};

export const Spider = () => {
	const hp = Roll().four().d10().value + 8;

	return DmPlayer.makeDmPlayer({
		name: 'Spider',
		statBlock: '/assets/stat-blocks/spider.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'spider.png',
		bannerImage: DMBannerImages.Spider,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/16895-giant-spider',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const Dog = (color: string) => {
	const hp = Roll().four().d8().value + 4;

	return DmPlayer.makeDmPlayer({
		name: `${color} Dog`,
		statBlock: '/assets/stat-blocks/Dog.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'Dog.png',
		bannerImage: DMBannerImages.Dog,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/16809-blink-dog',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const DevilDog = () => {
	const hp = Roll().four().d8().value + 10;

	return DmPlayer.makeDmPlayer({
		name: 'Wizard Dog',
		statBlock: '/assets/stat-blocks/DevilDog.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'DevilDog.png',
		bannerImage: DMBannerImages.DevilDog,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/360889-devil-dog',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const HerpesHag = () => {
	const hp = Roll().five().d8().value + 5;

	return DmPlayer.makeDmPlayer({
		name: 'Herpes Hag',
		statBlock: '/assets/stat-blocks/HerpesHag.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'HerpesHag.png',
		bannerImage: DMBannerImages.HerpesHag,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/273441-asha-vandree',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const JoshWerewolf = () => {
	const hp = Roll().four().d8().value;

	return DmPlayer.makeDmPlayer({
		name: 'Josh The Werewolf',
		statBlock: '/assets/stat-blocks/JoshWolf.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'JoshWolf.png',
		bannerImage: DMBannerImages.JoshWolf,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/17164-jackalwere',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const Hunter = () => {
	const hp = Roll().nine().d8().value + 27;

	return DmPlayer.makeDmPlayer({
		name: 'Cleetus The Hunter',
		statBlock: '/assets/stat-blocks/HunterTavern.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'HunterTavern.png',
		bannerImage: DMBannerImages.Hunter,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/297941-axe-of-mirabar-veteran',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const PurpleTentacle = (tip: 'Blue' | 'White') => {
	const hp = Roll().four().d8().value + 8;

	return DmPlayer.makeDmPlayer({
		name: `Purple Tentacle (${tip})`,
		statBlock: '/assets/stat-blocks/PurpleTentacle.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'PurpleTentacle.png',
		bannerImage: DMBannerImages.PurpleTentacle,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/2821149-astral-blight',
		dmNotes: 'AC 12',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const RedTentacle = (tip: 'Yellow' | 'Green') => {
	const hp = Roll().four().d8().value + 8;

	return DmPlayer.makeDmPlayer({
		name: `Red Tentacle (${tip})`,
		statBlock: '/assets/stat-blocks/RedTentacle.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'RedTentacle.png',
		bannerImage: DMBannerImages.RedTentacle,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/2821149-astral-blight',
		dmNotes: 'AC 1d4 + 12',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const Shubub = () => {
	const hp = Roll().nine().d10().value + 18;

	return DmPlayer.makeDmPlayer({
		name: 'Shubub',
		statBlock: '/assets/stat-blocks/Shubub.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'Shubub.png',
		bannerImage: DMBannerImages.Shubub,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: '',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const Deputy = (name: string) => {
	const hp = Roll().five().d8().value + 5;

	return DmPlayer.makeDmPlayer({
		name,
		statBlock: '/assets/stat-blocks/BasicDeputy.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'BasicDeputy.png',
		bannerImage: DMBannerImages.BasicDeputy,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/16817-bugbear',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};

export const Connor = () => {
	const hp = Roll().six().d8().value + 6;

	return DmPlayer.makeDmPlayer({
		name: 'Connor (Early Son)',
		statBlock: '/assets/stat-blocks/Connor.png',
		seat: ElectroDmConfig.dmSeat,
		image: 'Connor.png',
		bannerImage: DMBannerImages.Connor,
		race: PlayerRace.Monster,
		playerClass: PlayerClass.Fighter,
		playerType: PlayerType.DM,
		link: 'https://www.dndbeyond.com/monsters/17420-feathergale-knight',
		dmNotes: '',
		health: hp,
		maxHp: hp,
		initiative: Roll().d20().value,
	});
};
