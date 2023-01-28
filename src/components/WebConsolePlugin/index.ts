import { WebConsole, WebConsoleCommand } from "../WebConsole";
import { WebConsolePrintOptions } from "../WebConsole/types";

export default class WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Plugin';

	constructor() {
		this.docReady(this.register.bind(this));
	}

	docReady(fn: Function) {
		if (document.readyState === "complete" || document.readyState === "interactive") {
			setTimeout(fn, 1);
		} else {
			setTimeout(fn, 1);
		}
	}

	register() {
		this._console = document.querySelector('web-console');

		this.onRegister();
	}

	onRegister() {
		console.warn('no onRegister() implemented');
	}

	execute(command: WebConsoleCommand) {
		this.printLn(`no execute() implemented for ${command.command}`, { class: 'warn' });
	}

	help(_command: WebConsoleCommand) {
		this.printLn('no help() implemented', { class: 'warn' });
	}

	print(text: string, options: WebConsolePrintOptions = {}) {
		this._console.printLn(text, options);
	}

	printLn(text: string, options: WebConsolePrintOptions = {}) {
		this._console.printLn(text, options);
	}

	typeLn(text: string): void {
		this._console.typeLn(text);
	}

	autocompleteOptionsForCommand(command: WebConsoleCommand): Array<string> {
		return null;
	}
}
