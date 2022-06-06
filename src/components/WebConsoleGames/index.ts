import WebConsolePlugin from "../WebConsolePlugin";
import { WebConsole, WebConsoleCommand } from "../WebConsole";

type tictactoeState = Number;
type tictactoeRow = Array<tictactoeState>;
type tictactoeBoard = Array<tictactoeRow>;

export default class WebConsoleGames extends WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Tools';

	ticktactoeNext = 1;
	ticktactoeBoard: tictactoeBoard = [];

	onRegister() {
		this._console.registerCommand('tictactoe', this, this.tictactoe.bind(this));
	}

	generateBoard(size: number = 3) {
		for (let i = 0; i < size; i++) {
			this.ticktactoeBoard.push([]);
			for (let j = 0; j < size; j++) {
				this.ticktactoeBoard[i].push(0);
			}
		}
	}

	renderBoard() {
		let board = '';
		board += `Next move is ${this.ticktactoeNext === -1 ? 'O' : 'X'} \n`;
		for (let i = 0; i < this.ticktactoeBoard.length; i++) {
			for (let j = 0; j < this.ticktactoeBoard[i].length; j++) {
				let fieldValue = '';
				if (this.ticktactoeBoard[i][j] === -1) {
					fieldValue = '<span class="button">X</span>';
				} else if (this.ticktactoeBoard[i][j] === 1) {
					fieldValue = '<span class="button">O</span>';
				} else {
					fieldValue = `<span class="button" data-command="tictactoe move ${j + 1} ${i + 1}">.</span>`;
				}
				board += `${fieldValue}`;
			}
			board += '\n\n';
		}
		this.printLn('\n' + board.trim(), { html: true, key: 'tictactoefield', clearKey: 'tictactoefield' });
		return board;
	}

	tictactoe(command: WebConsoleCommand) {
		if (command.subcommands === null) {
			if (this.ticktactoeBoard.length === 0) {
				this.generateBoard();
			}
			this.renderBoard();
		} else if (command.subcommands[0] === 'new') {
			let size = 3;
			if (command.subcommands[1]) {
				size = parseInt(command.subcommands[1]);
			}

			this.ticktactoeBoard = [];
			this.generateBoard(size);
			this.renderBoard();
		} else if (command.subcommands[0] === 'move') {
			let j = parseInt(command.subcommands[1]) - 1;
			let i = parseInt(command.subcommands[2]) - 1;

			let markAs = this.ticktactoeNext === 1 ? -1 : 1;
			if (this.ticktactoeBoard[i][j] === 0) {
				this.ticktactoeBoard[i][j] = markAs;
				this.ticktactoeNext = this.ticktactoeNext === 1 ? -1 : 1;
				this.renderBoard();
			} else {
				this.printLn('That space is already taken.');
			}
		}
	}

}

window.customElements.define('web-console-games', WebConsoleGames);