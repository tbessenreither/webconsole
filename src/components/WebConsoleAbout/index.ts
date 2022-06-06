import WebConsolePlugin from "../WebConsolePlugin";
import WebConsole from "../WebConsole";
import { WebConsoleCommand } from "../WebConsole/types";

export default class WebConsolePluginAbout extends WebConsolePlugin {
	_console: WebConsole = null;
	name = 'About';

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

	execute(command: WebConsoleCommand) {
		this.commandDefaults(command);

		if (command.subcommands[0] === 'Tobias') {
			this.printLn(`Ich bin Tobias und Webentwickler`);
		} else if (command.subcommands[0] === 'WebConsole') {
			this.printLn(`Mir war langweilig, deshalb hab ich das hier geschrieben.`);
		} else {
			this.printLn(`Über ${command.subcommands[0]} weiß ich leider nichts`);
		}
	}

	help(command?: WebConsoleCommand) {
		if (command.subcommands[0] === 'about') {
			this.printLn('Ich kann dir etwas über folgende Dinge erzählen:');
			this.printLn(' - Tobias');
			this.printLn(' - WebConsole');
		} else {
			this.printLn(`Über ${command.subcommands[0]} weiß ich leider nichts`);
		}
	}

}

window.customElements.define('web-console-about', WebConsolePluginAbout);