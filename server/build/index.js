"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketInstance = exports.HttpInstance = exports.ExpressInstance = void 0;
var express_1 = __importDefault(require("express"));
var index_1 = require("../../shared/index");
var PlayerLogic_1 = require("./PlayerLogic");
var SerialLogic_1 = require("./SerialLogic");
var WebServer_1 = require("./WebServer");
exports.ExpressInstance = (0, express_1.default)();
// tslint:disable-next-line: no-var-requires
exports.HttpInstance = require('http').Server(exports.ExpressInstance);
// tslint:disable-next-line: no-var-requires
exports.WebSocketInstance = require('socket.io')(exports.HttpInstance, {
    allowEIO3: true,
    cors: {
        origin: index_1.ElectroDmConfig.clientUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    },
});
var serialLogic = SerialLogic_1.SerialLogic.makeSerial(index_1.ElectroDmConfig.baudRate, index_1.ElectroDmConfig.port);
var playerLogic = PlayerLogic_1.PlayerLogic.makePlayerLogic(serialLogic);
var server = new WebServer_1.WebServer(playerLogic, serialLogic, index_1.ElectroDmConfig.serverPort, index_1.ElectroDmConfig.ip);
server.setup();
