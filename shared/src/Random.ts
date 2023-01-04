/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

enum Dice {
	d20 = 'd20',
	d12 = 'd12',
	d10 = 'd10',
	d6 = 'd6',
	d4 = 'd4',
	d100 = 'd100',
}

export const DiceConfig = {
	[Dice.d20]: {
		min: 1,
		max: 20,
		average: 10.5,
	},
	[Dice.d12]: {
		min: 1,
		max: 12,
		average: 6.5,
	},
	[Dice.d10]: {
		min: 1,
		max: 10,
		average: 5.5,
	},
	[Dice.d6]: {
		min: 1,
		max: 6,
		average: 3.5,
	},
	[Dice.d4]: {
		min: 1,
		max: 4,
		average: 2.5,
	},
	[Dice.d100]: {
		min: 1,
		max: 100,
		average: 50.5,
	},
};

class DiceRoll {
	value: number = 0;
	private lastModifier: number = 1;

	d100 = () => this.roll(Dice.d100);
	d20 = () => this.roll(Dice.d20);
	d12 = () => this.roll(Dice.d12);
	d10 = () => this.roll(Dice.d10);
	d6 = () => this.roll(Dice.d6);
	d4 = () => this.roll(Dice.d4);

	private roll(dice: Dice) {
		while (this.lastModifier >= 1) {
			const roll = getRandomInt(
				DiceConfig[dice].min,
				DiceConfig[dice].max
			);
			console.log('roll: ' + dice);
			this.value += roll;
			this.lastModifier--;
		}

		this.lastModifier = 1;
		return this;
	}

	one() {
		this.lastModifier = 1;
		return this;
	}

	two() {
		this.lastModifier = 2;
		return this;
	}

	three() {
		this.lastModifier = 3;
		return this;
	}

	four() {
		this.lastModifier = 4;
		return this;
	}

	five() {
		this.lastModifier = 5;
		return this;
	}

	six() {
		this.lastModifier = 6;
		return this;
	}

	seven() {
		this.lastModifier = 7;
		return this;
	}

	eight() {
		this.lastModifier = 8;
		return this;
	}

	nine() {
		this.lastModifier = 9;
		return this;
	}

	ten() {
		this.lastModifier = 10;
		return this;
	}
}

export const Roll = () => {
	return new DiceRoll();
};
