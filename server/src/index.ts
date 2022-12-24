import cors from "cors";
import express from "express";
import * as serial from "serialport";

const arduinoSerialPort = "/dev/tty.usbserial-1120";
const baudRate = 9600;
const httpPort = 8080;
let serialPort: serial.SerialPort;

const app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http, {
	allowEIO3: true, // false by default
	cors: {
		origin: "http://192.168.1.144:4200",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	},
});
app.use(
	cors({
		origin: "*",
		allowedHeaders: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
		credentials: true,
	})
);

let players: any[] = [];
let currentPlayerIndex: number | undefined = 0;

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
	console.log("a user connected");

	socket.on("getPlayers", (value: any) => {
		socket.emit('playersChanged', players);
	});

	socket.on("players", (value: any) => {
		players = value;
		io.emit('playersChanged', players);
	});

	socket.on("currentPlayerIndex", (value: number | undefined) => {
		currentPlayerIndex = value;
		io.emit('currentPlayerIndexChanged', currentPlayerIndex);
	});

	socket.on("message", (message: string) => {
		socket.emit("message", "Hello from server");
		io.emit('playersChanged', players);
		io.emit('currentPlayerIndexChanged', currentPlayerIndex);
	});
});

app.get("/", (req, res) => {
	res.send("Electro DM Server Running");
});

app.get("*", (req, res) => {
	res.send("Electro DM Server Running");
});

// app.get("/connect", async (req, res) => {
// 	await connectToSerialPort();
// 	res.send("Connected to Arduino");
// });

// app.get("/send", async (req, res) => {
// 	const command = req.query.command;
// 	if (!command) {
// 		res.status(400);
// 		res.send("You must provide a command URL parameter");
// 		return;
// 	}

// 	if (!serialPort) {
// 		await connectToSerialPort();
// 	}

// 	serialPort.write(`${command}\n`, "ascii");
// 	res.send("Sent command");
// });

// app.get("/disconnect", (req, res) => {
// 	serialPort.destroy();
// 	res.send("Disabled SerialPort connection to Arduino");
// });

http.listen(httpPort, "192.168.1.144", () => {
	console.log(`server started at http://localhost:${httpPort}`);
});

const connectToSerialPort = async () => {
	return; // TODO: Uncomment for use!
	serialPort = new serial.SerialPort({
		path: arduinoSerialPort,
		baudRate,
	});

	return new Promise<void>((resolve) => {
		serialPort.open(() => {
			resolve();
		});
	});
};
