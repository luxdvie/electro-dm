import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ElectroDmConfig } from '../../../../shared/src';

@Injectable({
	providedIn: 'root',
})
export class SocketServiceService {
	socket!: Socket;

	constructor() {
		this.socket = io(ElectroDmConfig.apiUrl);
	}

	setupSocketConnection() {}

	send(key: string, value: any) {
		this.socket.emit(key, value);
	}

	fromEvent(key: string) {
		const sub = new Subject();
		this.socket.on(key, (any) => {
			sub.next(any);
		});

		return sub.asObservable();
	}
}
