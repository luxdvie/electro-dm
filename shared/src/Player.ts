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
	name: string;
	initiative: number;
	conditions: Condition[] = [];
	playerType: PlayerType;
	seat: number = 0;
	image: string | null = null;
	backgroundOffset: number;
	race: PlayerRace;
	playerClass: PlayerClass;
	link: string | null = null;
	dmNotes: string | null = null;

	constructor(
		name: string,
		seat: number,
		image: string | null,
		race: PlayerRace,
		playerClass: PlayerClass,
		type: PlayerType = PlayerType.DM,
		link: string | null = null,
		dmNotes: string | null = null
	) {
		this.name = name;
		this.initiative = 0;
		this.playerType = type;
		this.seat = seat;
		this.image = image;
		this.backgroundOffset = 0;
		this.race = race;
		this.playerClass = playerClass;
		this.link = link;
		this.dmNotes = dmNotes;
	}

	setInitiative(value: number) {
		this.initiative = value;
	}

	reset() {
		this.conditions = [];
		this.setInitiative(0);
	}

	addCondition(condition: Condition) {
		if (this.conditions.indexOf(condition) === -1) {
			this.conditions.push(condition);
		}
	}

	removeCondition(condition: Condition) {
		const index = this.conditions.findIndex((c) => c === condition);
		if (index > -1) {
			this.conditions.splice(index, 1);
			this.conditions = this.conditions;
		}
	}
}
