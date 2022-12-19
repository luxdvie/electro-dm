export enum Condition {
	Paralyzed = "Paralyzed",
	Asleep = "Asleep",
	Poisoned = "Poisoned",
	Normal = "Normal",
	Concentration = "Concentration",
}

export enum PlayerType {
	Player = "Player",
	DM = "DM",
}

export class Player {
	name: string;
	initiative: number;
	conditions: Condition[] = [];
	playerType: PlayerType;
	seat: number = 0;
	image: string | null = null;

	constructor(
		name: string,
		seat: number,
		image: string | null,
		type: PlayerType = PlayerType.DM
	) {
		this.name = name;
		this.initiative = 0;
		this.playerType = type;
		this.seat = seat;
		this.image = image;
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
