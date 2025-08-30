import WebConsolePlugin from "../WebConsolePlugin";
import { WebConsole, WebConsoleCommand } from "../WebConsole";
import { WebConsoleAutocompleteResponse } from "../WebConsole/types";

import randomOtter from './otters';

export default class WebConsoleAbout extends WebConsolePlugin {
	_console: WebConsole = null;
	name = 'About';
	dateOfBirth = '1986-10-21';
	numberOfMovies = 506;
	numberOfRecords = 123;
	numberOfTelescopes = 3;

	abouts: { [key: string]: Array<string> } = {
		WebConsole: [
			`Ich probiere gern mal neues Zeug aus und was dabei raus kommt ist dann zum beispiel sowas hier.`,
			`Unter anderem habe mir hier schon Nachrichten auf einen POS Drucker schicken lassen oder mit <a href="https://projects.tobias.bessenreither.de/three01/" target="_blank">WebGL</a> experimentiert.`,
			`Die Web console ist Comandline Interface geschrieben in Javascript. Gerendert wird die Ausgabe dann über pre und code tags.`,
			`Als minimalistische Userinterface habe ich clickbare commands eingebaut, primäre Eingabeform ist jedoch die Komandozeile.`,
			``,
			`Obwohl das meiste hier durch klicks auf die gelben Texte erreichbar ist gibt es einiges das nur durch ausprobieren und die Texteingabe zu finden ist.`,
			`Warum probierst du es nicht aus und suchst die Easter Eggs?`,
		],
		Tobias: [
			`Das bin ich.`,
			`Geboren am 21.10.1986 und damit aktuell ${this.getAge(this.dateOfBirth)} Jahre alt.`,
			`Von Beruf bin ich Software-Entwickler, Primär mit Web Technologien.`,
			`Mit Krawatte wird man mich nie treffen, dafür haben im Grunde alle meine Shirts irgend einen mehr oder weniger uniqen Aufdruck.`,
		],
		Fotografie: [
			`Oh, ein großartiges Thema.`,
			`Fotografie ist seit Jahren ein Hobby dem ich immer mal wieder nachgehe.`,
			`Eine Auswahl meiner Bilder kannst du dir <a href="https://tobias.bessenreither.de/" target="_blank">hier</a> anschauen.`,
			`Größtenteils fotografiere ich mit einer Nikon D5500 und dem 18-55mm Zoom Objektiv.`,
			`Am liebsten irgendwas mit Natur.`,
		],
		Astro: [
			`Ich liebe sterne und den Weltraum, so hab ich inzwischen ${this.numberOfTelescopes} Teleskope.`,
			`Unter anderem ein 1300mm Maksutov und ein 12" 1500mm Dobson sowie ein Seestar 50.`,
			`Die Bilder die ich mit dem Foto Equipment mache findet ihr in meiner <a href="https://tobias.bessenreither.de/index.php?/category/92">Piwigo Galerie</a>.`,
		],
		Filme: [
			`Mein zweites großes Hobby.`,
			`Wenn ich nicht gerade Programmiere oder Fotografiere wäre der dritte Platz an dem man mich suchen sollte in meinem Heimkino.`,
			`Dort schaue ich vermutlich gerade einen meiner ${this.numberOfMovies} Filme.`,
			`Ob Arthouse, Classics, Action oder ein anderes Genre. Geschaut wird was interessant wirkt.`
		],
		Platten: [
			`Neben Filmen baue ich auch nach und nach meine Plattensammlung aus.`,
			`Angefangen nachdem Spotify zwei meiner Lieblingsalben aus dem Sortiment genommen hat und ich festgestellt habe das einige meiner CDs schon nicht mehr funktionieren habe ich beschlossen in ein Medium zu investieren das mich überlebt.`,
			`Inzwischen stehen ${this.numberOfRecords} Schallplatten bei mir zuhause rum.`,
		],
		Arbeit: [
			`Ich arbeite derzeit als Backend Entwickler für eine Firma aus Hannover.`,
			`Davor war ich Softwareentwickler in Kiel und davor Webentwickler bei einer Fullservice Werbeagentur in der Oberpfalz und davor selbstständig im Bereich Backend Entwicklung & System-Design und Hosting.`,
		],
		Socials: [
			`Auf folgenden Plattformen könnt ihr mich finden:`,
			` - <a href="https://github.com/tbessenreither" target="_blank">GitHub</a>`,
			` - <a href="https://www.xing.com/profile/Tobias_Bessenreither" target="_blank">Xing</a>`,
			` - <a href="https://de.linkedin.com/in/tobias-bessenreither" target="_blank">LinkedIn</a>`,
			` - <a href="https://www.youtube.com/channel/UCqWvqUR5KkDAM4ELT1QhXZQ" target="_blank">YouTube</a>`,
		],
		Tierschutz: [
			`Aktiv setze ich mich immer wieder für den Schutz von Ottern und Haien ein.`,
			`So bin ich seit inzwischen vielen Jahren Mitglied in der <a href="https://aktion-fischotterschutz.de/start" target="_blank">Aktion Fischotterschutz</a>.`,
			`Auch das <a href="https://www.vanaqua.org/">Vancouver Aquarium</a> und das <a href="https://www.marinemammalcenter.org/">The Marine Mammal Center</a> sind Organisationen die ich gerne unterstütze.`,
			`Für Haie unterstütze ich aktiv die Organisation <a href="https://sharkangels.org/what-we-do/" target="_blank">Shark Angels</a> mit deren Hoodie ihr mich im Winter regelmäßig sehen könnt.`,
		],
	}

	unlistedAbouts: { [key: string]: Array<string> } = {
		Eastereggs: [
			`Ja, ich habe einige Eastereggs eingebaut.`,
			`Aber suchen musst du schon selbst.`,
		],
		Single: [
			`Ja, warum fragst du?`,
			`<span data-command="contact">Kontakt</span>`,
		],
	};

	onRegister() {
		this._console.registerCommand('about', this, this.execute.bind(this));
		this._console.registerCommand('contact', this, this.contact.bind(this));
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
		if (command.subcommandLenght() === 0) {
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
		} else if (this.abouts[command.subcommands[0]] !== undefined || this.unlistedAbouts[command.subcommands[0]] !== undefined) {
			let about = this.abouts[command.subcommands[0]] || this.unlistedAbouts[command.subcommands[0]];

			this.printLn(``, { key: 'about', clearKey: 'about' });
			this.printLn(`Über ${command.subcommands[0]}:`, { class: 'subtitle', key: 'about' });
			for (let line of about) {
				this.printLn(line, { html: true, key: 'about' });
			}
			this.printLn(``, { key: 'about' });
			this.printLn(`Mehr über: ${this.moreAboutLinks(command.subcommands[0])}`, { html: true, key: 'about' });
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
		if (command.command === 'about' && command.subcommandLenght() <= 1) {
			return this.getAboutKeys();
		}
		return null;
	}

	async contact(command: WebConsoleCommand) {
		this.printLn(`Gib jetzt deine Nachricht an mich ein.`, { class: 'title' });

		let message = await this._console.requestInput();
		console.info('contact', { message });

		this.printLn(`Danke aber leider können Nachrichten gerade noch nicht verarbeitet werden.`, {});
		this.printLn(`Hätte ich vielleicht vorher sagen sollen. Mein Fehler. Sorry`);
		this.printLn('');
		this.printLn(`Aber positiv gesehen, die Texteingabe funktioniert 1A. Danke fürs Testen.`);
		this.printLn(`Hier ein Keks 🍪`);
	}
}
let webconsoleAbout = new WebConsoleAbout();
