import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BattleService } from 'src/app/services/battle.service';
import { DBService } from 'src/app/services/db.service';
import {
	ElectroDmConfig,
	Player,
	PlayerBase,
	PlayerType
} from '../../../../../shared/src';
import { PlayerClass, PlayerRace } from '../../../../../shared/src/PlayerClass';
import { PlayerEditDialog } from './player-edit-dialog-component';

@Component({
	selector: 'app-player-config',
	templateUrl: './player-config.component.html',
	styleUrls: ['./player-config.component.scss'],
})
export class PlayerConfigComponent implements OnInit {
	players: Player[] = [];
	get brightness() {
		return ElectroDmConfig.brightness;
	}
	set brightness(value: number) {
		if (ElectroDmConfig.brightness != value) {
			this.battleService.sendCommand(`CB,${value}`);
		}

		ElectroDmConfig.brightness = value;
	}

	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	constructor(
		private dbService: DBService,
		public dialog: MatDialog,
		protected battleService: BattleService
	) {}

	async ngOnInit() {
		this.players = await this.dbService.getPlayers();
	}

	addCharacter() {
		// TODO: Open the edit modal right away
		this.players.push(
			PlayerBase.makePlayer({
				name: 'New Player ' + (this.players.length + 1),
				image: 'unknown.png',
				race: PlayerRace.Human,
				playerClass: PlayerClass.Monk,
				playerType: PlayerType.Player,
				dmNotes: 'player character',
			})
		);

		this.save();
	}

	deletePlayer = (player: Player) => {
		if (
			confirm(
				`Are you sure you want to delete ${player.name}. This cannot be undone.`
			)
		) {
			const deleteAt = this.players.findIndex((p) => p.id === player.id);
			if (deleteAt > -1) {
				this.players.splice(deleteAt, 1);
				this.save();
			}
		}
	};

	save() {
		this.dbService.savePlayers(this.players);
		this.battleService.reset();
	}

	editPlayer(player: Player): void {
		const dialogRef = this.dialog.open(PlayerEditDialog, {
			data: {
				player,
			},
			height: '80vh',
			width: '80vw',
		});

		dialogRef.afterClosed().subscribe((player: Player | undefined) => {
			if (!player) return;
			const replaceAt = this.players.findIndex((p) => p.id === player.id);

			if (replaceAt > -1) {
				this.players.splice(
					replaceAt,
					1,
					PlayerBase.makePlayer(player)
				);
				this.save();
			}
		});
	}
}
