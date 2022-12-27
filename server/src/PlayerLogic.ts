import { Socket } from 'socket.io';
import { WebSocketInstance } from '.';
import { PresentationMode, SocketEvents } from '../../shared/src/SocketEvents';
import { SerialLogic } from './SerialLogic';

let players: any[] = [];
let currentPlayerIndex: number | undefined = 0;
let scene: PresentationMode = PresentationMode.Initiative;

let _playerLogic: PlayerLogic | undefined;
export class PlayerLogic {
	private constructor(protected serialLogic: SerialLogic) {}

	onHello = (socket: Socket) => {
		socket.emit(SocketEvents.PlayersChanged, players);
		socket.emit(SocketEvents.PlayerIndexChanged, currentPlayerIndex);
	};

	onRefreshPlayers = (socket: Socket) => {
		socket.emit(SocketEvents.PlayersChanged, players);
	};

	onConfigureServer = (data: { numLEDs: number; numPlayers: number }) => {
		this.serialLogic.sendCommand(`CS,${data.numLEDs},${data.numPlayers}`);
	};

	onNewPlayers = (newPlayers: any[]) => {
		players = newPlayers;
		WebSocketInstance.emit(SocketEvents.PlayersChanged, players);
	};

	onSetScene = (newScene: PresentationMode) => {
		scene = newScene;
		console.log('scene :>> ', scene);
		WebSocketInstance.emit(SocketEvents.SceneChanged, scene);
	};

	onRefreshScene = (socket: Socket) => {
		socket.emit(SocketEvents.SceneChanged, scene);
	};

	onNewPlayerIndex = async (index: number | undefined) => {
		currentPlayerIndex = index;

		if (currentPlayerIndex !== undefined) {
			const player = players[currentPlayerIndex];
			if (player) {
				let sCommand = 'P' + (Number(player.seat) + 1);
				if (player.playerType === 'DM') {
					sCommand = 'PD';
				}

				await this.serialLogic.sendCommand(sCommand);
			}
		}

		WebSocketInstance.emit('currentPlayerIndexChanged', currentPlayerIndex);
	};

	/**
	 * Converts a command given to the web server (for a player)
	 * into an appropriate serial command.
	 *
	 * @param playerCommand The command given to the web server.
	 */
	interceptAndConvertCommand(playerCommand: string) {
		if (playerCommand[0] !== 'P') {
			return playerCommand;
		}

		if (playerCommand[1] === 'N') {
			const numPlayers = players.length;
			if (currentPlayerIndex === undefined) {
				currentPlayerIndex = -1;
			}

			currentPlayerIndex++;
			if (currentPlayerIndex >= numPlayers) {
				currentPlayerIndex = 0;
			}

			const player = players[currentPlayerIndex];
			if (player) {
				playerCommand = 'P' + (Number(player.seat) + 1);
				if (player.playerType === 'DM') {
					playerCommand = 'PD';
				}

				WebSocketInstance.emit(
					SocketEvents.PlayerIndexChanged,
					currentPlayerIndex
				);
			}
		} else if (playerCommand[0] === 'P') {
			const index = parseInt(playerCommand[1], undefined);
			if (!Number.isNaN(index)) {
				currentPlayerIndex = index;
				const player = players[currentPlayerIndex];
				if (player) {
					playerCommand = 'P' + (Number(player.seat) + 1);
					if (player.playerType === 'DM') {
						playerCommand = 'PD';
					}

					WebSocketInstance.emit(
						SocketEvents.PlayerIndexChanged,
						currentPlayerIndex
					);
				}
			}
		}

		return playerCommand;
	}

	static makePlayerLogic(serialLogic: SerialLogic) {
		if (_playerLogic) {
			return _playerLogic;
		}

		_playerLogic = new PlayerLogic(serialLogic);
		return _playerLogic;
	}
}
