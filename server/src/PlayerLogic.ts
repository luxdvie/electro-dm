import { Socket } from 'socket.io';
import { WebSocketInstance } from '.';
import { DEFAULT_BREAK_TIME_MS } from '../../shared/src/ElectroDmConfig';
import { PresentationMode, SocketEvents } from '../../shared/src/SocketEvents';
import { SerialLogic } from './SerialLogic';

let players: any[] = [];
let currentPlayerIndex: number | undefined = 0;
let scene: PresentationMode = PresentationMode.Initiative;
/** If scene is in 'Timer' mode, how much time is left?  */
let timeRemainingMs = 0;
let countdownInterval: any = null;
let keepTimeInterval: any = null;

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

	/** How frequently we send the server time to the client to reconcile differences in time remaining. */
	countdownTimerTickDelayMs = 20000;

	private onKeepTimeIntervalTick = () => {
		timeRemainingMs -= 1000;
		timeRemainingMs = Math.max(0, timeRemainingMs);

		if (timeRemainingMs === 0) {
			clearInterval(countdownInterval);
			clearInterval(keepTimeInterval);
			WebSocketInstance.emit(SocketEvents.TimerFinished, timeRemainingMs);
		}
	};

	private countdownTimerTick = () => {
		WebSocketInstance.emit(SocketEvents.TimerUpdated, timeRemainingMs);
	};

	onAddTime = (timeMs: number) => {
		if (scene !== PresentationMode.Timer) {
			return;
		}

		timeRemainingMs += timeMs;
		timeRemainingMs = Math.max(0, timeRemainingMs);
		WebSocketInstance.emit(SocketEvents.TimerUpdated, timeRemainingMs);
	};

	onSetScene = (newScene: PresentationMode) => {
		const isNewScene = newScene !== scene;
		scene = newScene;
		if (!isNewScene) {
			return;
		}

		if (scene === PresentationMode.Timer && timeRemainingMs === 0) {
			timeRemainingMs = DEFAULT_BREAK_TIME_MS;
			clearInterval(countdownInterval);
			clearInterval(keepTimeInterval);
			countdownInterval = setInterval(
				this.countdownTimerTick,
				this.countdownTimerTickDelayMs
			);

			keepTimeInterval = setInterval(this.onKeepTimeIntervalTick, 1000);
		}

		WebSocketInstance.emit(SocketEvents.SceneChanged, scene);
	};

	onRefreshScene = (socket: Socket) => {
		socket.emit(SocketEvents.SceneChanged, scene);
	};

	onRefreshTime = (socket: Socket) => {
		if (scene === PresentationMode.Timer) {
			socket.emit(SocketEvents.TimerUpdated, timeRemainingMs);
		}
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
