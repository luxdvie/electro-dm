import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
	providedIn: "root",
})
export class SocketServiceService {
	constructor(private socket: Socket) {
		this.socket.fromEvent("message").subscribe((message: any) => {
			console.log(`Message received: ${message}`);
		});

		this.socket.emit("message", "Hello");
	}

	send(key: string, value: any) {
		this.socket.emit(key, value);
	}

	fromEvent(key: string) {
		return this.socket.fromEvent(key);
	}
}
