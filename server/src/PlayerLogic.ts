import { Socket } from 'socket.io';
import { WebSocketInstance } from '.';
import { SocketEvents } from '../../shared/src/SocketEvents';
import { SerialLogic } from './SerialLogic';

let players: any[] = [];
let currentPlayerIndex: number | undefined = 0;

let _playerLogic: PlayerLogic | undefined;
export class PlayerLogic {
	private constructor(protected serialLogic: SerialLogic) {}

	onHello = (socket: Socket) => {
		socket.emit('playersChanged', players);
		socket.emit('currentPlayerIndexChanged', currentPlayerIndex);
	};

	onRefreshPlayers = (socket: Socket) => {
		socket.emit(SocketEvents.PlayersChanged, players);
	};

	onNewPlayers = (newPlayers: any[]) => {
		players = newPlayers;
		WebSocketInstance.emit(SocketEvents.PlayersChanged, players);
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
