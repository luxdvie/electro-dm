import { Component, OnInit } from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import {
	Connor,
	DMBannerImages,
	Deputy,
	DevilDog,
	Dog,
	Dragonborn,
	ElectroDmConfig,
	EngineerDevi,
	Goblin,
	HerpesHag,
	Hunter,
	JoshWerewolf,
	Nightwalker,
	Player,
	PlayerBase,
	PlayerType,
	PurpleTentacle,
	RedTentacle,
	Rohan,
	Shubub,
	Spider,
	Tiefling,
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

	selectedPlayer: Player | null = null;

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

	currentPlayer: Player | undefined;
	currentPlayerIndex: number | undefined = undefined;

	constructor(
		protected battleService: BattleService,
		private socketService: SocketServiceService
	) {}

	ngOnInit(): void {
		this.battleService.battleActive$.subscribe((isActive) => {
			this.isBattleActive = isActive;
		});

		this.battleService.currentPlayerIndex$.subscribe((idx) => {
			this.currentPlayerIndex = idx;
			if (this.currentPlayerIndex !== undefined) {
				const player = this.players[this.currentPlayerIndex];
				this.selectPlayer(player);
			}
		});
	}

	focusTo: Player | null = null;
	focusNext: boolean = false;

	ngAfterViewChecked() {
		if (!this.focusTo) return;

		const byInit = this.players.slice().sort(BattleService.sortByInit);
		let targetFocusPlayer = this.focusTo.id;

		for (let i = 0; i < byInit.length; i++) {
			const player = byInit[i];
			if (player.initiative === 0) {
				targetFocusPlayer = player.id;
				break;
			}
		}

		if (!targetFocusPlayer && this.focusNext) {
			const indexOfFocusTo = byInit.findIndex(
				(p) => p.id === this.focusTo?.id
			);
			if (indexOfFocusTo > -1) {
				let nextIndex = indexOfFocusTo + 1;
				if (nextIndex >= byInit.length) {
					nextIndex = 0;
				}

				targetFocusPlayer = byInit[nextIndex].id;
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
		this.focusNext = false;
	}

	onTabKeydown = (event: Event, player: Player) => {
		this.focusNext = true;
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
		setTimeout(() => {
			this.battleService.savePlayers();
		});
	}

	async reset() {
		await this.battleService.reset();
		this.selectedPlayer = null;
	}

	startOrNext() {
		this.battleService.startOrNext();
	}

	addChar() {
		this.battleService.addChar(
			PlayerBase.makePlayer({
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
		this.battleService.addChar(Goblin());
	}

	addSpider() {
		this.battleService.addChar(Spider());
	}

	addNightWalker() {
		this.battleService.addChar(Nightwalker());
	}

	addRohan() {
		this.battleService.addChar(Rohan());
	}

	addDeputies() {
		this.battleService.addChar(Deputy('Deputy Gomer "Goober" Smoot'));
		this.battleService.addChar(Deputy('Deputy Daisy May Taterbug'));
	}

	addHerpesBattle() {
		this.battleService.addChar(Dog('Red'));
		this.battleService.addChar(Dog('Green'));
		this.battleService.addChar(Dog('Blue'));
		this.battleService.addChar(DevilDog());
		this.battleService.addChar(HerpesHag());
	}

	addJoshWolf() {
		this.battleService.addChar(JoshWerewolf());
	}

	addHunter() {
		this.battleService.addChar(Hunter());
	}

	addDevi() {
		this.battleService.addChar(EngineerDevi());
	}

	addBBEG() {
		this.battleService.addChar(PurpleTentacle('Blue'));
		this.battleService.addChar(PurpleTentacle('White'));
		this.battleService.addChar(RedTentacle('Yellow'));
		this.battleService.addChar(RedTentacle('Green'));
		this.battleService.addChar(Shubub());
	}

	addHighwayBattle() {
		this.battleService.addChar(Connor());
		this.battleService.addChar(Spider());
	}

	addDisasterAtTheBazaar() {
		this.battleService.addChar(Tiefling('Tiefling Leader'));
		this.battleService.addChar(Tiefling('Tiefling Captain'));
		this.battleService.addChar(Tiefling('Tiefling Recruit'));
		this.battleService.addChar(Dragonborn());
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

	getDamageValue(player: Player): number | undefined {
		const id = `#hp-ele-${player.id}`;
		const input = document.querySelector(id) as HTMLInputElement;

		let value: number | undefined = undefined;
		if (input) {
			const iValue = parseInt(input.value);
			if (!Number.isNaN(iValue)) {
				value = parseInt(input.value);
			}

			input.value = '';
		}

		return value;
	}

	applyDamage(player: Player) {
		const damage = this.getDamageValue(player);
		if (damage !== undefined) {
			player.applyDamage(damage);
			this.battleService.savePlayers();
		}
	}

	applyHeal(player: Player) {
		const heal = this.getDamageValue(player);
		if (heal !== undefined) {
			player.applyHeal(heal);
			this.battleService.savePlayers();
		}
	}

	selectPlayer(player: Player) {
		this.selectedPlayer = player;
	}
}
