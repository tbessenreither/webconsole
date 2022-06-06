import WebConsole from "../WebConsole";
import { WebConsoleCommand, WebConsolePrintOptions } from "../WebConsole/types";

export default class WebConsolePlugin extends HTMLElement {
	_console: WebConsole = null;
	name: string = 'Plugin';

	register(console: WebConsole) {
		this._console = console;

		this.onRegister();
	}

	onRegister() {
		console.warn('no onRegister() implemented');
	}


	execute(command: WebConsoleCommand) {
		this.printLn(`no execute() implemented for ${command.command}`, {class: 'warn'});
	}

	help(_command: WebConsoleCommand) {
		this.printLn('no help() implemented', {class: 'warn'});
	}

	print(text: string, options: WebConsolePrintOptions = {}) {
		this._console.printLn(text, options);
	}

	printLn(text: string, options: WebConsolePrintOptions = {}) {
		this._console.printLn(text, options);
	}
}
