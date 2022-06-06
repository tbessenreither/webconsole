import WebConsolePlugin from "../WebConsolePlugin";
import { WebConsole, WebConsoleCommand } from "../WebConsole";
import { WebConsoleAutocompleteResponse } from "../WebConsole/types";

import randomOtter from './otters';

export default class WebConsoleAbout extends WebConsolePlugin {
	_console: WebConsole = null;
	name = 'About';
	dateOfBirth = '1986-10-21';

	abouts: { [key: string]: Array<string> } = {
		WebConsole: [
			`Ich probiere gern mal neues Zeug aus und was dabei raus kommt ist dann zum beispiel sowas hier.`,
			`Unter anderem habe mir hier schon Nachrichten auf einen POS Drucker schicken lassen oder mit <a href="https://projects.tobias.bessenreither.de/three01/" target="_blank">WebGL</a> experimentiert.`,
			`Die Web console ist Comandline Interface geschrieben in Javascript. Gerendert wird die Ausgabe dann über pre und code tags.`,
			`Als minimalistische Userinterface habe ich clickbare commands eingebaut, primäre Eingabeform ist jedoch die Komandozeile.`
		],
		Tobias: [
			`Das bin ich.`,
			`Geboren am 21.10.1986 und damit aktuell ${this.getAge(this.dateOfBirth)} Jahre alt.`,
			`Von Beruf bin ich Web- und App-Entwickler.`,
		],
		Fotografie: [
			`Oh, ein großartiges Thema.`,
			`Fotografie ist seit Jahren ein Hobby dem ich immer mal wieder nachgehe.`,
			`Eine Auswahl meiner Bilder kannst du dir <a href="https://bessenreither.de/" target="_blank">hier</a> anschauen.`,
			`Größtenteils fotografiere ich mit einer Nikon D5500 und dem 18-55mm Zoom Objektiv.`,
			`Am liebsten irgendwas mit Natur.`,
		],
		Arbeit: [
			`Ich arbeite im Moment bei Webprojaggt, einer Web & Werbeagentur in der Oberpfalz.`,
			`Davor war ich selbstständig im Bereich Backend Entwicklung & System-Design und Hosting.`,
		],
		Torsten: [
			'Torsten ist ein anderer Befehl',
		],
	}

	onRegister() {
		this._console.registerCommand('about', this, this.execute.bind(this));
	}

	commandDefaults(command: WebConsoleCommand) {
		if (command.command === 'about') {
			this.commandDefaultsAbout(command);
		}
	}
	commandDefaultsAbout(command: WebConsoleCommand) {
		if (!command.subcommands) {
			command.subcommands = [];
		}
		if (command.subcommands.length === 0) {
			command.subcommands.push('Tobias');
		}
	}

	getAge(dateString: string) {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	getAboutKeys() {
		return Object.keys(this.abouts).sort();
	}

	execute(command: WebConsoleCommand) {
		if (command.subcommands === null) {
			return this.help(new WebConsoleCommand('help about'));
		}

		if (command.subcommands[0] === 'Otter') {
			this.print(`Otter sind toll\n` + randomOtter(), { class: '' })
		} else if (this.abouts[command.subcommands[0]] !== undefined) {
			this.printLn(``, { key: 'about', clearKey: 'about' });
			this.printLn(`Über ${command.subcommands[0]}:`, { class: 'subtitle', key: 'about' });
			for (let line of this.abouts[command.subcommands[0]]) {
				this.printLn(line, { html: true, key: 'about' });
			}
			this.printLn(`Mehr über: ${this.moreAboutLinks(command.subcommands[0])}`, { html: true, key: 'about' });
			this.printLn(``, { key: 'about' });
		} else {
			this.printLn(`Über ${command.subcommands[0]} weiß ich leider nichts`);
		}
	}

	moreAboutLinks(currentAbout: string) {
		let links = [];
		for (let about of this.getAboutKeys()) {
			if (about !== currentAbout) {
				links.push(`<span data-command="about ${about}">${about}</span>`);
			}
		}
		return links.join(', ');
	}

	help(command?: WebConsoleCommand) {
		if (command.subcommands[0] === 'about') {
			this.printLn('Ich kann dir etwas über folgende Dinge erzählen:');
			let aboutStrings = this.getAboutKeys();
			for (let about of aboutStrings) {
				this.printLn(` - <span data-command="about ${about}">${about}</span>`, { html: true });
			}
		} else {
			this.printLn(`Über ${command.subcommands[0]} weiß ich leider nichts`);
		}
	}

	autocompleteOptionsForCommand(command: WebConsoleCommand): Array<string> {
		if (command.command === 'about' && command.subcommands.length === 1) {
			return this.getAboutKeys();
		}
		return null;
	}

}

window.customElements.define('web-console-about', WebConsoleAbout);