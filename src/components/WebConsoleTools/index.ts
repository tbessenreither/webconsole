import WebConsolePlugin from "../WebConsolePlugin";
import { WebConsole, WebConsoleCommand } from "../WebConsole";

export default class WebConsoleTools extends WebConsolePlugin {
	name: string = 'Tools';

	onRegister() {
		this._console.registerCommand('json', this, this.json.bind(this));
		this._console.registerCommand('ts', this, this.timestamp.bind(this));
	}

	json(command: WebConsoleCommand) {
		const jsonString = command.getStringRaw().split(' ').slice(1).join(' ');
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
let webConsoleTools = new WebConsoleTools();

class WebConsoleEastereggs extends WebConsolePlugin {

	onRegister(): void {
		this._console.registerCommand('eastereggs', this, this.eastereggs.bind(this), { hidden: true });
		this._console.registerCommand('rm', this, this.rm.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('rmdir', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('ls', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('mkdir', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('touch', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('vi', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('vim', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
		this._console.registerCommand('nano', this, this.fakeProtected.bind(this), { blocking: true, hidden: true });
	}

	eastereggs(command: WebConsoleCommand) {
		this.printLn(`you think it would be THIS easy?`);
	}

	help(command: WebConsoleCommand) {
		if (command.subcommands[0] === 'eastereggs') {
			return this.eastereggs(command);
		} else if (command.subcommands[0] === 'rm') {
			return this.rmHelp();
		}
	}

	wait(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async backendConnection() {
		this.printLn(`Backend command detected`, { class: 'info' });
		await this.wait(1000);
		this.printLn(`establishing connection.`, { key: 'connecting' });
		await this.wait(1000);
		this.printLn(`establishing connection..`, { key: 'connecting', clearKey: 'connecting' });
		await this.wait(500);
		this.printLn(`establishing connection...`, { key: 'connecting', clearKey: 'connecting' });
		await this.wait(200);
		this.printLn(`establishing connection....`, { key: 'connecting', clearKey: 'connecting' });
		await this.wait(200);
		this.printLn(`establishing connection.....`, { key: 'connecting', clearKey: 'connecting' });
		await this.wait(100);
		this.printLn(`connection established`, { class: 'success' });
		await this.wait(500);
		this.printLn(`security check failed`, { class: 'error' });
	}

	async _rmMessages(args: { dir: string, force: boolean }) {
		await this.backendConnection();
		await this.wait(1000);
		this.printLn(`retry`, {});
		if (args.force) {
			this.printLn(`force mode enabled`, { class: 'warning' });
		}
		this.printLn(`running command on dir ${args.dir}`, {});
	}
	_rmDelete(args: { dir: string, force: boolean }) {
		return new Promise((resolve) => {
			let deleteProgress = 0;
			let deleteInterval = setInterval(() => {
				deleteProgress++;
				this.printLn(`deleting ${deleteProgress}%`, { key: 'rm', clearKey: 'rm', class: 'info' });
				if (
					(!args.force && deleteProgress > 12)
					|| deleteProgress >= 100
				) {
					clearInterval(deleteInterval);
					if (args.force) {
						this.printLn(`complete`, { class: 'success' });
					} else {
						this.printLn(`could not complete. try again with <span data-command='rm -dir="${args.dir}" -force'>force mode</span>`, { html: true, class: 'error' });
					}
					resolve(true);
				}
			}, 200);
		});
	}

	rmHelp() {
		this.printLn(`rm: backend interface to delete files and folders.`, { class: 'info' });
		this.printLn(`usage: rm -dir="[path]" [-force]`, { html: true });
	}

	async rm(command: WebConsoleCommand) {
		if (command.arguments.help) {
			this.rmHelp();
			return;
		}
		if (!command.arguments.dir) {
			this.printLn(`rm: missing operand`, { class: 'error' });
			this.printLn(`Try 'rm -help' for more information.`, { class: 'error' });
			return;
		}
		let args = {
			dir: command.arguments.dir.value,
			force: command.arguments?.force?.value || false,
		};
		await this._rmMessages(args);
		await this._rmDelete(args);

	}

	async fakeProtected() {
		await this.backendConnection();
	}
}
let webConsoleEastereggs = new WebConsoleEastereggs();