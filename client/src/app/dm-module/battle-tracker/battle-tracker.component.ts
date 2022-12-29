import { Component, OnInit } from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { ElectroDmConfig, Player } from '../../../../../shared/src';

@Component({
	selector: 'app-battle-tracker',
	templateUrl: './battle-tracker.component.html',
	styleUrls: ['./battle-tracker.component.scss'],
})
export class BattleTrackerComponent implements OnInit {
	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	get players() {
		return this.battleService.players;
	}

	get currentPlayerIndex() {
		return this.battleService.currentPlayerIndex;
	}

	constructor(
		protected battleService: BattleService,
		private socketService: SocketServiceService
	) {}

	ngOnInit(): void {}

	ngAfterViewInit() {
		console.log('at view init');
	}

	focusTo: Player | null = null;

	ngAfterViewChecked() {
		if (!this.focusTo) return;

		const byInit = this.players.slice().sort(BattleService.sortByInit);
		let targetFocusPlayer = this.focusTo.name;

		for (let i = 0; i < byInit.length; i++) {
			const player = byInit[i];
			if (player.initiative === 0) {
				targetFocusPlayer = player.name;
				break;
			}
		}

		setTimeout(() => {
			const ele = document.querySelector(
				`[data-player="${targetFocusPlayer}"]`
			);

			if (ele) {
				(ele as HTMLElement).focus();
			}
		}, 200);

		this.focusTo = null;
	}

	onTabKeydown = (event: Event, player: Player) => {
		this.focusTo = player;
	};

	onEnterKeydown = (_event: Event, player: Player) => {
		this.focusTo = player;
	};

	focusedPlayer: Player | null = null;
	selectOnFocus(ev: FocusEvent, player: Player) {
		this.focusedPlayer = player;
		if (ev && ev.currentTarget) {
			(ev.currentTarget as HTMLInputElement).select();
		}
	}

	orderPlayers(changedPlayer?: Player) {
		this.battleService.orderPlayers();
	}

	reset() {
		this.battleService.reset();
	}

	startOrNext() {
		this.battleService.startOrNext();
	}

	addChar() {
		this.battleService.addChar();
	}
}
