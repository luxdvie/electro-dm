import cors from 'cors';
import { Socket } from 'socket.io';
import { ExpressInstance, HttpInstance, WebSocketInstance } from '.';
import {
	ElectroDmConfig,
	PresentationMode,
	SocketEvents
} from '../../shared/src';
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

		ExpressInstance.get('/addTime', async (req, res) => {
			const time = req.query.time;
			if (!time) {
				res.status(400);
				res.send('You must provide a time URL parameter');
				return;
			}

			const nTime = parseInt(time as string, undefined);
			if (Number.isNaN(nTime)) {
				res.status(400);
				res.send(
					'Invalid time provided. Provide an integer representing milliseconds.'
				);
				return;
			}

			this.playerLogic.onAddTime(nTime);
			res.send('Time added.');
		});

		ExpressInstance.get('/setPage', async (req, res) => {
			const page = req.query.page;
			if (!page) {
				res.status(400);
				res.send('You must provide a page URL parameter');
				return;
			}

			const nPage = parseInt(page as string, undefined);
			if (Number.isNaN(nPage)) {
				res.status(400);
				res.send(
					'Invalid page provided. Provide an page number starting with 0.'
				);
				return;
			}

			this.playerLogic.onGoToPage(nPage);
			res.send('Went to page ' + nPage);
		});

		ExpressInstance.get('/nextPage', async (req, res) => {
			this.playerLogic.onNextPage();
			res.send('Went to next page.');
		});

		ExpressInstance.get('/previousPage', async (req, res) => {
			this.playerLogic.onPreviousPage();
			res.send('Went to previous page.');
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

			socket.on(SocketEvents.RefreshTime, () => {
				this.playerLogic.onRefreshTime(socket);
			});

			socket.on(SocketEvents.RefreshStoryPage, () => {
				this.playerLogic.onRefreshPage(socket);
			});

			socket.on(SocketEvents.RefreshScene, () => {
				this.playerLogic.onRefreshScene(socket);
			});

			socket.on(SocketEvents.AddTime, this.playerLogic.onAddTime);

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
