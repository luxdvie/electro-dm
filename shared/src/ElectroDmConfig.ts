import { PlayerClass, PlayerRace } from './PlayerClass';

/******
	! Change these value to match your setup!
******/
export const NUM_LEDS = 362;
export const IP_ADDRESS = '192.168.1.144'; // The IP Address of the server.
export const DEFAULT_BREAK_TIME_MS = 5 * 60 * 1000; // The default time to allocate when you schedule a 'break' (5 Minutes)
export const STARTING_PLAYERS: StartingPlayer[] = [
	{
		name: 'Frances',
		seat: 0,
		image: null,
		race: PlayerRace.Kender,
		playerClass: PlayerClass.Cleric,
		link: 'https://www.dndbeyond.com/characters/90780383',
		dmNotes: `
			Give Frances a challenging problem or interesting story.
		`,
	},
	{
		name: 'Cassandra Ravage',
		seat: 1,
		image: 'tyler.jpeg',
		race: PlayerRace.Bugbear,
		playerClass: PlayerClass.Barbarian,
		link: 'https://www.dndbeyond.com/characters/89965980',
		dmNotes: `
			Tyler wants to be able to rage and bw WWE cool.
		`,
	},
	{
		name: 'Drip',
		seat: 2,
		image: 'zach.jpeg',
		race: PlayerRace.Plasmoid,
		playerClass: PlayerClass.Fighter,
		link: 'https://www.dndbeyond.com/characters/23432572',
		dmNotes: `
			Zach wants to slime through walls.
		`,
	},
	{
		name: 'Angelica',
		seat: 3,
		image: 'bgreen.jpeg',
		race: PlayerRace.Fairy,
		playerClass: PlayerClass.Sorcerer,
		link: 'https://www.dndbeyond.com/characters/71815075',
		dmNotes: `
			What does BGreen want to do with Angelica?
		`,
	},
	{
		name: 'Nathan',
		seat: 4,
		image: null,
		race: PlayerRace.RockGnome,
		playerClass: PlayerClass.Barbarian,
		link: null,
		dmNotes: `
			Let Nathan shoot stuff.
		`,
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
