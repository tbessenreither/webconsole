import WebConsolePlugin from "../WebConsolePlugin";
import WebConsole from "../WebConsole";
import { WebConsoleCommand } from "../WebConsole/types";

export default class WebConsoleCore extends WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Plugin';

	myCommands: Array<string> = [
		'help', 'clear', 'init', 'error',
	];

	onRegister() {
		this._console.registerCommand('help', this, this.help.bind(this));
		this._console.registerCommand('clear', this, this._console.clear);
		this._console.registerCommand('init', this, this._console.init);
		this._console.registerCommand('error', this, ()=>{ throw new Error('what did you think would happen?')});
	}

	help(command: WebConsoleCommand) {
		try {
			if (command.subcommands === null) {
				this.printLn('Available commands:', { class: 'info subtitle' });
				for (let command in this._console.commands) {
					this.printLn(` - ${command}`);
				}
			} else {
				if (this.myCommands.includes(command.subcommands[0])) {
					this.coreHelp(command);
				} else {
					this._console.invoke(command.subcommands[0], 'help', command);
				}
			}
		} catch (err) {
			this.printLn(`Oh no, the help failed 😱`, { class: 'error' });
			this.printLn(err, { class: 'error' });
		}
	}

	coreHelp(command: WebConsoleCommand) {
		this.printLn(`Help for ${command.subcommands[0]}:`, { class: 'info subtitle' });
		if (command.subcommands[0] === 'help') {
			this.printLn('prints this help');
		} else if (command.subcommands[0] === 'clear') {
			this.printLn('Clears the console');
		} else if (command.subcommands[0] === 'init') {
			this.printLn('resets the console');
		} else {
			this.printLn(`no forther information available`);
		}
	}

}

window.customElements.define('web-console-core', WebConsoleCore);