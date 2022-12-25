interface StartingPlayer {
	name: string;
	seat: number;
	image: string | null;
}

export enum Commands {
	Off = 'Off',
	ShowDM = 'PD',
	Fireball = 'F',
}

export const IP_ADDRESS = '192.168.1.144'; // The IP Address of the server.
export const SERVER_PORT = 8080; // The port on which the server app runs.
export const CLIENT_PORT = 4200; // The port on which the frontend app runs.

export const ElectroDmConfig = {
	baudRate: 9600,
	port: undefined, // Leave undefined to default to 'Find' the serial port
	ip: IP_ADDRESS,
	serverPort: SERVER_PORT,
	clientPort: CLIENT_PORT,
	apiUrl: `http://${IP_ADDRESS}:${SERVER_PORT}`,
	clientUrl: `http://${IP_ADDRESS}:${CLIENT_PORT}`,
	dmSeat: 998,
	startingPlayers: [
		{
			name: 'Frances',
			seat: 0,
			image: null,
		},
		{
			name: 'Sandra Ravage',
			seat: 1,
			image: 'tyler.jpeg',
		},
		{
			name: 'Drip',
			seat: 2,
			image: 'zach.jpeg',
		},
		{
			name: 'Angelica',
			seat: 3,
			image: 'bgreen.jpeg',
		},
		{
			name: 'Nathan',
			seat: 4,
			image: null,
		},
	],
	numPlayers: () => {
		return ElectroDmConfig.startingPlayers.length;
	},
};
