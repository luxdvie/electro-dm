import { Component, OnInit } from '@angular/core';
import { BattleService } from 'src/app/services/battle.service';
import { ElectroDmConfig } from '../../../../../shared/src';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
	get clientUrl(): string {
		return ElectroDmConfig.clientUrl;
	}

	constructor(protected battleService: BattleService) {}

	ngOnInit(): void {}

	async start() {
		await this.battleService.reset();
		this.battleService.startOrNext();
		window.open(this.clientUrl, '_blank');
	}
}
