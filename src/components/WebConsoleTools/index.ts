import WebConsolePlugin from "../WebConsolePlugin";
import { WebConsole, WebConsoleCommand} from "../WebConsole";

export default class WebConsoleTools extends WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Tools';

	onRegister() {
		this._console.registerCommand('json', this, this.json.bind(this));
		this._console.registerCommand('ts', this, this.timestamp.bind(this));
	}

	json(command: WebConsoleCommand) {
		const jsonString = command.getString().split(' ').slice(1).join(' ');
		const jsonData = JSON.parse(jsonString);
		console.info(jsonString);
		this.printLn("\n" + JSON.stringify(jsonData, null, 2), { copy: true });
	}

	timestamp(command: WebConsoleCommand) {
		let timestamp = command.subcommands ? parseInt(command.subcommands[0]) : Math.round(Date.now() / 1000);
		this.printLn(`Timestamp converter`, { class: 'info subtitle' });
		this.printLn(`Unix timestamp: <span data-copy>${timestamp}</span>`, { html: true });
		this.printLn(`Date: <span data-copy>${new Date(timestamp * 1000).toLocaleString()}</span>`, { html: true });
		console.info({
			unix: timestamp,
			date: new Date(timestamp * 1000),
		});

	}

	help(command: WebConsoleCommand) {
		this.printLn(`Help for ${command.subcommands[0]}:`, { class: 'info subtitle' });
		if (command.subcommands[0] === 'json') {
			this.printLn('Converts a JSON string to a JSON object, logs it in the console and prints it nicely formated ready to copy.');
			this.printLn(`example: <span data-command='json [1, 2, 3, 4, "string"]'>[1, 2, 3, 4, "string"]</span>`, { html: true });
		} else if (command.subcommands[0] === 'ts') {
			this.printLn('Converts a Unix Timestamp to a readable date string, logs it in the console and prints it nicely formated ready to copy.');
			this.printLn(`example: <span data-command='ts'>ts</span>`, { html: true });
		} else {
			this.printLn(`I don't know anything about the ${command.subcommands[0]} command.`);
		}
	}

}

window.customElements.define('web-console-tools', WebConsoleTools);