import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-password-puzzle',
	templateUrl: './password-puzzle.component.html',
	styleUrls: ['./password-puzzle.component.scss'],
})
export class PasswordPuzzleComponent implements OnInit {
	password: string = 'bughunt';
	encryptedPassword: string = '';

	encryptedInput: string = '';
	encryptedOutput: string = '';

	constructor() {}

	ngOnInit(): void {
		this.formatPassword();
	}

	formatPassword() {
		setTimeout(() => {
			this.password = this.password.toLowerCase().trim();
			this.password = this.password.replace(/[^a-z]/gi, '');
			this.encrypt();
			this.encryptedInput = this.encryptedPassword;
			this.decryptPassword();
		});
	}

	encrypt() {
		let encryptedPw = '';
		this.password.split('').forEach((c) => {
			const indexInAlphabet = c.charCodeAt(0) - 96; // one-indexed position of letter in alphabet
			let encryptedDigit = indexInAlphabet + 5;
			encryptedDigit *= 10;
			encryptedPw = `${encryptedPw} ${encryptedDigit}`;
		});

		this.encryptedPassword = encryptedPw;
	}

	decryptPassword() {
		let decryptedPw = '';
		this.encryptedInput.split(' ').forEach((c) => {
			let num = parseInt(c) / 10;
			num = num - 5;
			const letter = String.fromCharCode(num + 96);
			decryptedPw += letter;
		});

		this.encryptedOutput = decryptedPw;
	}
}
