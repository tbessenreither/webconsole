import WebConsolePlugin from "../WebConsolePlugin";
import { WebConsole, WebConsoleCommand } from "../WebConsole";


export default class WebConsoleCore extends WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Core';
	listMaxHistoryItems = 10;

	myCommands: Array<string> = [
		'help', 'clear', 'init', 'error', 'history',
	];

	onRegister() {
		this._console.registerCommand('help', this, this.help.bind(this));
		this._console.registerCommand('clear', this, this._console.clear);
		this._console.registerCommand('init', this, this._console.init);
		this._console.registerCommand('error', this, () => { throw new Error('what did you think would happen?') });
		this._console.registerCommand('history', this, this.history.bind(this));
	}

	help(command: WebConsoleCommand) {
		try {
			if (command.subcommands === null) {
				this.printLn('Available commands:', { key: 'help', clearKey: 'help', class: 'info subtitle' });
				this.printLn(`type "help $command" for more information about a command`, { key: 'help' });
				//sort this._console.commands by key
				const cammandsSorted = this._console.getCommands();
				let longestCommand = 0;
				for (let command of cammandsSorted) {
					if (command.length > longestCommand) {
						longestCommand = command.length;
					}
				}
				longestCommand += 1;
				for (let command of cammandsSorted) {
					this.printLn(` - <span data-command='help ${command}'>${command}</span>${''.padEnd(longestCommand - command.length)} / <span data-command='${command}'>run</span>`, { html: true, key: 'help' });
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
		} else if (command.subcommands[0] === 'history') {
			this.printLn(`lists the last ${this.listMaxHistoryItems} commands used.`);
		} else {
			this.printLn(`no forther information available`);
		}
	}

	history() {
		this.printLn(`Command History (last ${this.listMaxHistoryItems}):`, { class: 'info subtitle' });

		let historyToPrint = this._console.getCommandHistory(this.listMaxHistoryItems);
		for (let command of historyToPrint) {
			this.printLn(` - <span data-command='${command}'>${command}</span>`, { html: true });
		}
	}

	autocompleteOptionsForCommand(command: WebConsoleCommand): string[] {
		if (command.command === 'help' && command.subcommandLenght() <= 1) {
			return this._console.getCommands();
		}
		return null;
	}

}

window.customElements.define('web-console-core', WebConsoleCore);