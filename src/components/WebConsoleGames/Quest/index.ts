import WebConsolePlugin from "../../WebConsolePlugin";
import { WebConsole, WebConsoleCommand } from "../../WebConsole";

import GameState from "./GameState";

import Print from "./Print";

export default class Quest extends WebConsolePlugin {
	name = 'quest';

	_gameState: GameState;

	commands: { [key: string]: any } = {
		rename: {
			description: `Nutze entweder <span data-type>rename player </span>oder <span data-type>rename character </span> um dich oder deinen Charakter umzubenennen.`,
		},
		investigate: {
			description: `Nutze <span data-run>investigate</span> um die Umgebung zu untersuchen.`,
		},
		exit: {
			description: `Nutze <span data-type>exit</span> um das Spiel zu beenden.`,
		},
	}

	onRegister() {
		this._console.registerCommand('quest', this, this.execute.bind(this));
		this._console.registerBootCommand('quest');

		Print.setPrintLnFunction(this.printLn.bind(this));
	}

	async execute(command: WebConsoleCommand) {
		this._gameState = new GameState(this._console);
		this._console.clear();

		this.printLn('Willkommen bei Quest', { class: 'title' });

		this._gameState.load();

		if (this._gameState.gameInitiated) {
			this.printLn(`Hallo ${this._gameState.player.playerName},<br>schön das du wieder hier bist. Bereit mit dem Abenteuer weiter zu machen? ${this._gameState.player.name} wartet schon.`, { html: true });
		} else {
			this.printLn('Bevor wir loslegen, brauche ich noch ein paar Informationen von dir.', { html: true });

			this.printLn(`Wie soll dein Charakter heißen?`, {});
			let name = await this._console.requestInput() as string;

			this.printLn(`Und wie heißt du?`, {});
			let playerName = await this._console.requestInput() as string;

			this.printLn('Das war es auch schon. Viel Spaß!', { html: true });

			this._gameState.initiate(playerName.trim(), name.trim());

			this.printLn(`Hallo ${this._gameState.player.playerName},<br>schön dich zu sehen. Bereit auf ein Abenteuer zu gehen? ${this._gameState.player.name} wartet schon.`, { html: true });
		}

		this._console.captureInput(this.capturedInput.bind(this));

	}

	capturedInput(input: string): void {
		this.printLn(input, { direction: 'input' });
		if (input === 'exit') {
			return this.quit();
		} else if (input.startsWith('rename')) {
			if (input.startsWith('rename player')) {
				this._gameState.renamePlayer(input.substr(14).trim());
			} else if (input.startsWith('rename character')) {
				this._gameState.renameCharacter(input.substr(17).trim());
			} else {
				this.printHelp('rename');
			}
		} else if (input === 'save') {
			this._gameState.save();
		} else if (input === 'help') {
			this.printHelp();
		} else {
			this._gameState.command(input);
		}
		console.info('capturedInput', { input });
	}

	printHelp(commandString?: string) {
		if (!commandString) {
			this.printLn('Du kannst folgende Befehle verwenden:', { class: 'title' });
			for (let commandName in this.commands) {
				this.printHelp(commandName);
			}
		} else {
			let command = this.commands[commandString];
			this.printLn(`${commandString}`, { class: 'subtitle' });
			this.printLn(`${command.description}<br>`, { html: true });
		}
	}

	quit() {
		this._gameState.save();

		this._console.printLn('Auf Wiedersehen!');
		this._console.releaseInput();
	}

	help(command?: WebConsoleCommand) {
		this.printLn('Lust auf ein altmodisches Textadventure?');
		this.printLn('Dann bist du hier richtig. Gib einfach <span data-run>quest</span> ein um loszulegen.', { html: true });
	}
}

