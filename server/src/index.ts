import cors from "cors";
import express from "express";
import * as serial from "serialport";

const arduinoSerialPort = "/dev/tty.usbserial-1130";
const baudRate = 9600;
const httpPort = 8080;
let serialPort: serial.SerialPort;

const app = express();
app.use(
	cors({
		origin: "*",
		allowedHeaders: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
		credentials: true,
	})
);

app.get("/", (req, res) => {
	res.send("Electro DM Server Running");
});

app.get("/connect", async (req, res) => {
	await connectToSerialPort();
	res.send("Connected to Arduino");
});

app.get("/send", async (req, res) => {
	const command = req.query.command;
	if (!command) {
		res.status(400);
		res.send("You must provide a command URL parameter");
		return;
	}

	if (!serialPort) {
		await connectToSerialPort();
	}

	serialPort.write(`${command}\n`, "ascii");
	res.send("Sent command");
});

app.get("/disconnect", (req, res) => {
	serialPort.destroy();
	res.send("Disabled SerialPort connection to Arduino");
});

app.listen(httpPort, () => {
	console.log(`server started at http://localhost:${httpPort}`);
});

const connectToSerialPort = async () => {
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
