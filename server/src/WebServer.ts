import cors from 'cors';
import { Socket } from 'socket.io';
import { ExpressInstance, HttpInstance, WebSocketInstance } from '.';
import { ElectroDmConfig } from '../../shared/src/index';
import { PresentationMode, SocketEvents } from '../../shared/src/SocketEvents';
import { PlayerLogic } from './PlayerLogic';
import { SerialLogic } from './SerialLogic';

export class WebServer {
	constructor(
		protected playerLogic: PlayerLogic,
		protected serialLogic: SerialLogic,
		protected port: number,
		protected host: string
	) {}

	setup() {
		ExpressInstance.use(
			cors({
				origin: ElectroDmConfig.clientUrl,
				allowedHeaders: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
				credentials: true,
			})
		);

		ExpressInstance.get('/', (req, res) => {
			res.send('Electro DM Server Running');
		});

		ExpressInstance.get('/connect', async (req, res) => {
			const success = await this.serialLogic.connect();
			if (success) {
				res.send('Connected to controller.');
			} else {
				res.send('Could not connect to controller. See console.');
			}
		});

		ExpressInstance.get('/setScene', async (req, res) => {
			const scene = req.query.scene;
			if (!scene) {
				res.status(400);
				res.send('You must provide a scene URL parameter');
				return;
			}

			if (
				!Object.values(PresentationMode).includes(
					scene as PresentationMode
				)
			) {
				res.status(400);
				res.send('Invalid scene provided.');
				return;
			}

			this.playerLogic.onSetScene(scene as PresentationMode);

			res.send('Sent scene.');
		});

		ExpressInstance.get('/send', async (req, res) => {
			const command = req.query.command;
			if (!command) {
				res.status(400);
				res.send('You must provide a command URL parameter');
				return;
			}

			const sCommand = this.playerLogic.interceptAndConvertCommand(
				command as string
			);

			await this.serialLogic.sendCommand(sCommand);
			res.send('Sent command');
		});

		ExpressInstance.get('/disconnect', (req, res) => {
			const errorMessage = this.serialLogic.disconnect();
			res.send(
				errorMessage ?? 'Disabled SerialPort connection to controller.'
			);
		});

		HttpInstance.listen(
			ElectroDmConfig.serverPort,
			ElectroDmConfig.ip,
			() => {
				console.log(
					`Electro DM Server started on port ${ElectroDmConfig.serverPort}.`
				);
			}
		);

		WebSocketInstance.on('connection', (socket: Socket) => {
			socket.on(SocketEvents.RefreshPlayers, () => {
				this.playerLogic.onRefreshPlayers(socket);
			});

			socket.on(
				SocketEvents.ConfigureServer,
				this.playerLogic.onConfigureServer
			);

			socket.on(
				SocketEvents.PlayersReceived,
				this.playerLogic.onNewPlayers
			);

			socket.on(SocketEvents.RefreshScene, () => {
				this.playerLogic.onRefreshScene(socket);
			});

			socket.on(SocketEvents.SetScene, this.playerLogic.onSetScene);

			socket.on(
				SocketEvents.CurrentPlayerIndexReceived,
				this.playerLogic.onNewPlayerIndex
			);

			socket.on('message', (message: string) => {
				socket.emit('message', 'Hello from server');
				this.playerLogic.onHello(socket);
			});
		});
	}
}
