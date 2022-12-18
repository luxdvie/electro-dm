interface StartingPlayer {
	name: string;
	seat: number;
}

export enum Commands {
	Off = "Off",
	ShowDM = "PD",
	Fireball = "F",
}

export const config = {
	apiUrl: "http://localhost:8080",
	dmSeat: 6,
	startingPlayers: [
		{
			name: "Frances",
			seat: 0,
		},
		{
			name: "Sandra Ravage",
			seat: 1,
		},
		{
			name: "Drip",
			seat: 2,
		},
		{
			name: "Angelica",
			seat: 3,
		},
		{
			name: "Nathan",
			seat: 4,
		},
	],
	numPlayers: () => {
		return config.startingPlayers.length;
	},
};
