import WebConsolePlugin from "../WebConsolePlugin";
import WebConsole from "../WebConsole";
import { WebConsoleCommand } from "../WebConsole/types";

export default class WebConsoleAbout extends WebConsolePlugin {
	_console: WebConsole = null;
	name = 'About';
	dateOfBirth = '1986-10-21';

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

	execute(command: WebConsoleCommand) {
		if (command.subcommands === null) {
			return this.help({
				string: 'help about',
				command: 'help',
				subcommands: ['about'],
				arguments: {},
			});
		}

		if (command.subcommands[0] === 'Tobias') {
			this.printLn(``);
			this.printLn(`Das bin ich.`, { class: 'subtitle' });
			this.printLn(`Geboren am 21.10.1986 und damit aktuell ${this.getAge(this.dateOfBirth)} Jahre alt.`);
			this.printLn(`Von Beruf bin ich Web- und App-Entwickler.`);
			this.printLn(``);
		} else if (command.subcommands[0] === 'WebConsole') {
			this.printLn(``);
			this.printLn(`Ich probiere gern mal neues Zeug aus und was dabei raus kommt ist dann zum beispiel sowas hier.`);
			this.printLn(`Unter anderem habe mir hier schon Nachrichten auf einen POS Drucker schicken lassen oder mit <a href="https://projects.tobias.bessenreither.de/three01/" target="_blank">WebGL</a> experimentiert.`, { html: true });
			this.printLn(``);
		} else if (command.subcommands[0] === 'Fotografie') {
			this.printLn(``);
			this.printLn(`Oh, ein großartiges Thema.`, { class: 'subtitle' });
			this.printLn(`Fotografie ist seit Jahren ein Hobby dem ich immer mal wieder nachgehe`, {});
			this.printLn(`Eine Auswahl meiner Bilder kannst du dir <a href="https://bessenreither.de/" target="_blank">hier</a> anschauen`, { html: true });
			this.printLn(`Größtenteils fotografiere ich mit einer Nikon D5500 und dem 18-55mm Zoom Objektiv.`, {});
			this.printLn(`Am liebsten irgendwas mit Natur.`, {});
			this.printLn(``);
		} else {
			this.printLn(`Über ${command.subcommands[0]} weiß ich leider nichts`);
		}
	}

	help(command?: WebConsoleCommand) {
		if (command.subcommands[0] === 'about') {
			this.printLn('Ich kann dir etwas über folgende Dinge erzählen:');
			this.printLn(' - <span data-command="about Tobias">Tobias</span>', { html: true });
			this.printLn(' - <span data-command="about WebConsole">WebConsole</span>', { html: true });
			this.printLn(' - <span data-command="about Fotografie">Fotografie</span>', { html: true });
		} else {
			this.printLn(`Über ${command.subcommands[0]} weiß ich leider nichts`);
		}
	}

}

window.customElements.define('web-console-about', WebConsoleAbout);