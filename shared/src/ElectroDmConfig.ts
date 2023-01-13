import { PlayerClass, PlayerRace } from './PlayerClass';

export const NUM_LEDS = 344; // Put the number of LEDs you have here.

/******
 ! Don't change anything below here unless you know what
 you're doing. Feel free to raise a GitHub issue if something
 is unclear.
 ******/
export const DEFAULT_BREAK_TIME_MS = 5 * 60 * 1000; // The default time to allocate when you schedule a 'break' (5 Minutes)
export const BAUD_RATE = 9600;
export const SERIAL_PORT = undefined; // Leave 'undefined' to automatically find device
export const SERVER_PORT = 8080; // The port on which the server app runs.
export const CLIENT_PORT = 4200; // The port on which the frontend app runs.

export const ElectroDmConfig = {
	numLEDs: NUM_LEDS,
	baudRate: BAUD_RATE,
	brightness: 50,
	port: undefined, // Leave undefined to default to 'Find' the serial port
	ip: '127.0.0.1',
	serverPort: SERVER_PORT,
	clientPort: CLIENT_PORT,
	setIpAddress: (ip: string) => {
		ElectroDmConfig.ip = ip;
		ElectroDmConfig.apiUrl = `http://${ip}:${SERVER_PORT}`;
		ElectroDmConfig.clientUrl = `http://${ip}:${CLIENT_PORT}`;
	},
	apiUrl: `http://127.0.0.1:${SERVER_PORT}`,
	clientUrl: `http://127.0.0.7:${CLIENT_PORT}`,
	dmSeat: 998,
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
	link: string | null;
	dmNotes: string | null;
	race: PlayerRace;
	playerClass: PlayerClass;
}
