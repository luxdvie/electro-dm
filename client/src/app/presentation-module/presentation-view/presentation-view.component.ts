import { Component, OnInit } from '@angular/core';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import {
	ElectroDmConfig,
	PresentationMode,
	SocketEvents
} from '../../../../../shared/src';

@Component({
	selector: 'app-presentation-view',
	templateUrl: './presentation-view.component.html',
	styleUrls: ['./presentation-view.component.scss'],
})
export class PresentationViewComponent implements OnInit {
	scene: PresentationMode = PresentationMode.Initiative;
	timeRemaining: number = 0;
	timeRemainingFormatted: Date = new Date(0, 0, 0, 0, 0, 0);
	/** A flag used to know when the time just ran out, and Offline mode will resume shortly. */
	timeIsUp: boolean = false;
	seeYouSoon: boolean = true;

	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	/**
	 * A reference to the client timer that artificially reduces
	 * time shown on client.
	 * Will be sync'ed by server on the next time update event. */
	private tickTimer: any;
	/** How frequently we decrease the client-facing timer. */
	private timerTickDelayMs = 1000;

	constructor(protected socketService: SocketServiceService) {
		this.socketService
			.fromEvent(SocketEvents.SceneChanged)
			.subscribe((mode: any) => {
				this.setScene(mode as PresentationMode, false);
			});

		this.socketService
			.fromEvent(SocketEvents.TimerUpdated)
			.subscribe((newTime: any) => {
				const nTime = parseInt(newTime);
				if (!Number.isNaN(nTime)) {
					this.timeRemaining = nTime;

					const newFormattedValue = new Date(0, 0, 0, 0, 0, 0);
					newFormattedValue.setMilliseconds(this.timeRemaining);
					this.timeRemainingFormatted = newFormattedValue;

					this.startTimer();
					this.seeYouSoon = false;
				}
			});

		this.socketService
			.fromEvent(SocketEvents.TimerFinished)
			.subscribe(() => {
				this.stopTimer();
				this.timeIsUp = true;
				setTimeout(() => {
					this.setScene(PresentationMode.Offline);
					this.timeIsUp = false;
					this.seeYouSoon = true;
				}, 5000);
			});

		this.socketService.send(SocketEvents.RefreshTime, undefined);
		this.socketService.send(SocketEvents.RefreshScene, undefined);
	}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		this.stopTimer();
	}

	private startTimer = () => {
		this.stopTimer();
		window.clearInterval(this.tickTimer);
		this.tickTimer = window.setInterval(
			this.timerTick,
			this.timerTickDelayMs
		);
	};

	private stopTimer = () => {
		window.clearInterval(this.tickTimer);
		this.tickTimer = null;
	};

	private timerTick = () => {
		this.timeRemaining -= this.timerTickDelayMs;
		this.timeRemaining = Math.max(0, this.timeRemaining);

		const newFormattedValue = new Date(0, 0, 0, 0, 0, 0);
		newFormattedValue.setMilliseconds(this.timeRemaining);
		this.timeRemainingFormatted = newFormattedValue;

		if (this.timeRemaining === 0) {
			this.stopTimer();
		}
	};

	setScene(scene: PresentationMode, broadcast: boolean = true) {
		this.scene = scene;

		if (this.scene === PresentationMode.Timer) {
			this.seeYouSoon = true;
			this.socketService.send(SocketEvents.RefreshTime, undefined);
		} else {
			this.stopTimer();
		}

		if (broadcast) {
			this.socketService.send(SocketEvents.SetScene, this.scene);
		}
	}
}
