import WebConsolePlugin from "../WebConsolePlugin";
import WebConsole from "../WebConsole";
import { WebConsoleCommand } from "../WebConsole/types";

export default class WebConsoleTools extends WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Tools';

	onRegister() {
		this._console.registerCommand('json', this, this.json.bind(this));
	}

	json(command: WebConsoleCommand) {
		const jsonString = command.string.split(' ').slice(1).join(' ');
		const jsonData = JSON.parse(jsonString);
		console.log(jsonString);
		this.printLn("\n"+JSON.stringify(jsonData, null, 2), { copy: true });
	}

	help(command: WebConsoleCommand) {
		this.printLn(`Help for ${command.subcommands[0]}:`, { class: 'info subtitle' });
		if (command.subcommands[0] === 'json') {
			this.printLn('Converts a JSON string to a JSON object, logs it in the console and prints it nicely formated ready to copy.');
			this.printLn(`<span data-command='json [1, 2, 3, 4, "string"]'">example: [1, 2, 3, 4, "string"]</span>`, { html: true });
		} else {
			this.printLn(`I don't know anything about the ${command.subcommands[0]} command.`);
		}
	}

}

window.customElements.define('web-console-tools', WebConsoleTools);