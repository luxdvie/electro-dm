import * as serial from 'serialport';

let _serialSingleton: SerialLogic | undefined;

// const arduinoSerialPort = "/dev/tty.usbserial-120"; // "/dev/tty.usbserial-1120";

export class SerialLogic {
	private on: boolean = false;
	private loading: boolean = false;
	private instance: serial.SerialPort | undefined;
	private constructor(protected baudRate: number, protected port?: string) {}

	static makeSerial(baudRate: number, port?: string) {
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
		if (this.on) return;
		if (this.loading) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(this.init());
				}, 200);
			});
		}

		this.loading = true;
		if (!this.port) {
			this.port = '';
			const list = await serial.SerialPort.list();
			list.forEach((port) => {
				if (port.path.toLowerCase().indexOf('usbserial') > -1) {
					this.port = port.path;
				}
			});

			if (!this.port) {
				this.loading = false;
				console.error(
					'A Serial Port was not configured in ElectroDmConfig, and a "UsbSerial" device cannot be automatically found.'
				);
			}
		}

		return new Promise<void>((resolve, reject) => {
			try {
				console.log('Opening port: ' + this.port);
				this.instance = new serial.SerialPort({
					path: this.port!,
					baudRate: this.baudRate,
				});

				this.instance.addListener('error', () => {
					this.loading = false;
					reject();
				});

				this.instance.open(() => {
					this.on = true;
					this.loading = false;
					resolve();
				});
			} catch (ex) {
				console.error(
					'Could not open to serial port',
					JSON.stringify(ex)
				);

				this.loading = false;
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
			console.error(
				'Could not write serial command',
				JSON.stringify(err)
			);
		}
	};
}
