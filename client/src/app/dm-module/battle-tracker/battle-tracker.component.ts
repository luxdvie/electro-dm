import { Component, OnInit } from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import {
	DMBannerImages,
	ElectroDmConfig,
	Player,
	PlayerType
} from '../../../../../shared/src';
import { PlayerClass, PlayerRace } from '../../../../../shared/src/PlayerClass';

@Component({
	selector: 'app-battle-tracker',
	templateUrl: './battle-tracker.component.html',
	styleUrls: ['./battle-tracker.component.scss'],
})
export class BattleTrackerComponent implements OnInit {
	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	isBattleActive: boolean = false;

	dmImages = Object.keys(DMBannerImages).map((key) => {
		return {
			viewValue: key,
			value: (DMBannerImages as any)[key],
		};
	});

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

	ngOnInit(): void {
		this.battleService.battleActive$.subscribe((isActive) => {
			this.isBattleActive = isActive;
		});
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

	onChangeImage() {
		this.battleService.setPlayers(this.players);
	}

	async reset() {
		await this.battleService.reset();
	}

	startOrNext() {
		this.battleService.startOrNext();
	}

	addChar() {
		this.battleService.addChar(
			Player.makePlayer({
				name: 'DM Player ' + (this.players.length + 1),
				seat: ElectroDmConfig.dmSeat,
				image: 'dm.png',
				race: PlayerRace.Orc,
				playerClass: PlayerClass.Barbarian,
				playerType: PlayerType.DM,
				link: 'https://www.dndbeyond.com/monsters',
				dmNotes: 'dm character',
			})
		);
	}

	addGoblin() {
		this.battleService.addChar(
			Player.makePlayer({
				name: 'Goblin ' + (this.players.length + 1),
				seat: ElectroDmConfig.dmSeat,
				image: 'troll.png',
				bannerImage: DMBannerImages.Troll,
				race: PlayerRace.Goblin,
				playerClass: PlayerClass.Fighter,
				playerType: PlayerType.DM,
				link: 'https://www.dndbeyond.com/monsters',
				dmNotes: 'dm character',
			})
		);
	}

	deletePlayer(player: Player) {
		if (
			confirm(
				`Are you sure you want to delete ${player.name}. This cannot be undone.`
			)
		) {
			const deleteAt = this.players.findIndex((p) => p.id === player.id);
			if (deleteAt > -1) {
				this.players.splice(deleteAt, 1);
				this.battleService.setPlayers(this.players);
			}
		}
	}
}
