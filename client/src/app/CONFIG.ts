interface StartingPlayer {
	name: string;
	seat: number;
	image: string | null;
}

export enum Commands {
	Off = "Off",
	ShowDM = "PD",
	Fireball = "F",
}

export const config = {
	apiUrl: "http://192.168.1.144:8080",
	dmSeat: 6,
	startingPlayers: [
		{
			name: "Frances",
			seat: 0,
			image: null,
		},
		{
			name: "Sandra Ravage",
			seat: 1,
			image: "tyler.jpeg",
		},
		{
			name: "Drip",
			seat: 2,
			image: "zach.jpeg",
		},
		{
			name: "Angelica",
			seat: 3,
			image: "bgreen.jpeg",
		},
		{
			name: "Nathan",
			seat: 4,
			image: null,
		},
	],
	numPlayers: () => {
		return config.startingPlayers.length;
	},
};
