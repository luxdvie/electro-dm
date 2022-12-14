import express from 'express';
import * as ip from 'ip';
import { ElectroDmConfig } from '../../shared/src';
import { PlayerLogic } from './PlayerLogic';
import { SerialLogic } from './SerialLogic';
import { WebServer } from './WebServer';
export const ExpressInstance = express();

// tslint:disable-next-line: no-var-requires
export const HttpInstance = require('http').Server(ExpressInstance);

// tslint:disable-next-line: no-var-requires
export let WebSocketInstance: any;

setTimeout(() => {
	ElectroDmConfig.setIpAddress(ip.address());

	WebSocketInstance = require('socket.io')(HttpInstance, {
		allowEIO3: true,
		cors: {
			origin: ElectroDmConfig.clientUrl,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
		},
	});

	const serialLogic = SerialLogic.makeSerial(
		ElectroDmConfig.baudRate,
		ElectroDmConfig.port
	);

	const playerLogic = PlayerLogic.makePlayerLogic(serialLogic);

	const server = new WebServer(
		playerLogic,
		serialLogic,
		ElectroDmConfig.serverPort,
		ElectroDmConfig.ip
	);

	server.setup();
});
