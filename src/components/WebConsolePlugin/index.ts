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
		this._console.printLn(`no execute() implemented for ${command.command}`);
	}

	help(_command: WebConsoleCommand) {
		this._console.printLn('no help() implemented');
	}

	print(text: string, options: WebConsolePrintOptions = {}) {
		this._console.printLn(text, options);
	}

	printLn(text: string, options: WebConsolePrintOptions = {}) {
		this._console.printLn(text, options);
	}
}

window.customElements.define('web-console-plugin', WebConsolePlugin);