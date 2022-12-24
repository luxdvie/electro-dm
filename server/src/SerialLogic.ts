import * as serial from 'serialport';

let _serialSingleton: SerialLogic | undefined;

// const arduinoSerialPort = "/dev/tty.usbserial-120"; // "/dev/tty.usbserial-1120";
// const baudRate = 9600;

export class SerialLogic {
	private instance: serial.SerialPort | undefined;

	private constructor(protected baudRate: number, protected port: string) {}

	static makeSerial(baudRate: number, port: string) {
		if (_serialSingleton) {
			return _serialSingleton;
		}

		_serialSingleton = new SerialLogic(baudRate, port);
		return _serialSingleton;
	}

	disconnect(): string | undefined {
		if (!this.instance) return;

		try {
			this.instance.destroy();
		} catch (err) {
			console.error(
				'Could not disconnect from serial port',
				JSON.stringify(err)
			);

			return 'Could not destroy serial port instance';
		}
	}

	async connect(): Promise<string | undefined> {
		try {
			await this.init();
		} catch (err) {
			console.error(
				'Could not connect to serial port',
				JSON.stringify(err)
			);

			return 'Could not connect. See console.';
		}
	}

	private init = async () => {
		return new Promise<void>((resolve, reject) => {
			try {
				this.instance = new serial.SerialPort({
					path: this.port,
					baudRate: this.baudRate,
				});

				this.instance.addListener('error', () => {
					reject();
				});

				this.instance.open(() => {
					resolve();
				});
			} catch (ex) {
				console.error(
					'Could not open to serial port',
					JSON.stringify(ex)
				);
				resolve();
			}
		});
	};

	sendCommand = async (command: string) => {
		if (!this.instance) {
			try {
				await this.init();
			} catch (err) {
				console.error(
					'Could not open serial port for command',
					JSON.stringify(err)
				);
			}
		}

		if (!this.instance) return;

		try {
			this.instance.write(`${command}\n`, 'ascii');
		} catch (err) {
			console.log('Could not write serial command', JSON.stringify(err));
		}
	};
}
