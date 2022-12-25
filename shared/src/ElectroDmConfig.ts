/******
	! Change these value to match your setup!
******/
export const NUM_LEDS = 362;
export const IP_ADDRESS = '192.168.1.144'; // The IP Address of the server.
export const STARTING_PLAYERS: StartingPlayer[] = [
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
];

/******
	! Don't change anything below here unless you know what
	you're doing. Feel free to raise a GitHub issue if something
	is unclear.
******/
export const BAUD_RATE = 9600;
export const SERIAL_PORT = undefined; // Leave 'undefined' to automatically find device
export const SERVER_PORT = 8080; // The port on which the server app runs.
export const CLIENT_PORT = 4200; // The port on which the frontend app runs.

export const ElectroDmConfig = {
	numLEDs: NUM_LEDS,
	baudRate: BAUD_RATE,
	port: undefined, // Leave undefined to default to 'Find' the serial port
	ip: IP_ADDRESS,
	serverPort: SERVER_PORT,
	clientPort: CLIENT_PORT,
	apiUrl: `http://${IP_ADDRESS}:${SERVER_PORT}`,
	clientUrl: `http://${IP_ADDRESS}:${CLIENT_PORT}`,
	dmSeat: 998,
	startingPlayers: STARTING_PLAYERS,
	numPlayers: () => {
		return ElectroDmConfig.startingPlayers.length;
	},
};

export enum Commands {
	Off = 'Off',
	ShowDM = 'PD',
	Fireball = 'F',
}

interface StartingPlayer {
	/** Player's name. */
	name: string;
	/**
	 * Where is the player sitting? 0 means "directly to the left of the DM",
	 * and increments from there.
	 */
	seat: number;
	/**
	 * If desired, you can pick a custom picture for a player.
	 * Put their picture in `/client/src/assets/profile` and
	 * put that filename here.
	 */
	image: string | null;
}
