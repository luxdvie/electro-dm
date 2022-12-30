import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Player } from '../../../../../shared/src';
import { PlayerClass, PlayerRace } from '../../../../../shared/src/PlayerClass';

@Component({
	selector: 'player-edit-dialog',
	templateUrl: 'player-edit-dialog.html',
	styleUrls: ['player-edit-dialog.scss'],
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatInputModule,
		MatOptionModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
	],
})
export class PlayerEditDialog {
	playerCopy!: Player;
	form: { [key: string]: FormControl } = {
		name: new FormControl(''),
		race: new FormControl(''),
		playerClass: new FormControl(''),
		dmNotes: new FormControl(''),
		seat: new FormControl(''),
		image: new FormControl(''),
		link: new FormControl(''),
	};

	playerRaceOptions: string[] = Object.values(PlayerRace);
	filteredPlayerRaceOptions: Observable<string[]> = new Observable();

	playerClassOptions: string[] = Object.values(PlayerClass);
	filteredPlayerClassOptions: Observable<string[]> = new Observable();

	constructor(
		public dialogRef: MatDialogRef<PlayerEditDialog>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			player: Player;
		}
	) {
		this.playerCopy = Player.makePlayer(
			JSON.parse(JSON.stringify(data.player || {}))
		);
	}

	ngOnInit() {
		Object.keys(this.playerCopy).forEach((key) => {
			if (this.form.hasOwnProperty(key)) {
				this.form[key].setValue(this.playerCopy[key as keyof Player]);
				this.form[key].valueChanges.subscribe((value) => {
					(this.playerCopy as any)[key] = value;
				});
			}
		});

		this.filteredPlayerRaceOptions = this.form['race'].valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '', this.playerRaceOptions))
		);

		this.filteredPlayerClassOptions = this.form[
			'playerClass'
		].valueChanges.pipe(
			startWith(''),
			map((value) => this._filter(value || '', this.playerClassOptions))
		);
	}

	selectOnFocus(ev: FocusEvent) {
		if (ev && ev.currentTarget) {
			(ev.currentTarget as HTMLInputElement).select();
		}
	}

	private _filter(value: string, fromOptions: string[]): string[] {
		const filterValue = value.toLowerCase();

		return fromOptions.filter((option) =>
			option.toLowerCase().includes(filterValue)
		);
	}

	onSaveClick() {
		this.dialogRef.close(this.playerCopy);
	}

	onCancelClick(): void {
		this.dialogRef.close();
	}
}
