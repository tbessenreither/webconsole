import html from './index.html';
import css from './style.scss';

import { CcHTMLElement } from '../CcHTMLElement';
import WebConsolePlugin from '../WebConsolePlugin';
import { WebConsolePluginStore, WebConsoleCommandTargets, WebConsoleArguments, WebConsolePrintOptions, WebConsoleCommandOptions, WebConsoleAutocompleteResponse } from './types';
import MessageQueue from './MessageQueue';

const PACKAGE = require('../../../package.json');
const version = PACKAGE.version;

export class WebConsoleCommand {
	commandStringIn: string;
	command: string = '';
	subcommands: Array<string>;
	arguments: WebConsoleArguments = {};

	constructor(command?: string) {
		if (command) {
			this._getCommandParts(command);
		}
	}

	getString(): string {
		let commandString = this.command;

		if (this.subcommands !== null) {
			commandString += ' ' + this.subcommands.join(' ');
		}
		if (this.arguments) {
			commandString += ' ' + Object.keys(this.arguments).map((key) => {
				return `-${key}=${JSON.stringify(this.arguments[key].value)}`;
			}).join(' ');
		}
		commandString = commandString.trim();

		return commandString;
	}

	lastSubcommand(value: string | null = null): string | null {
		if (this.subcommands) {
			if (value !== null) {
				this.subcommands[this.subcommandLenght() - 1] = value;
			}
			return this.subcommands[this.subcommandLenght() - 1];
		} else if (value !== null) {
			this.subcommands = [value];
		}
		return null;
	}

	subcommandLenght(): number {
		return this.subcommands ? this.subcommands.length : 0;
	}

	getStringRaw() {
		return this.commandStringIn;
	}

	_getCommandParts(commandString: string): WebConsoleCommand {
		this.commandStringIn = commandString;
		const commandPattern = /^([\w]+)((?: [\w]+)+)?((?:[ ]*-[\w]+(?:="?[^"]+?"?)?)+)?$/;

		const command = commandString.split(' ').shift();
		let subcommands = null;
		const commandArguments: WebConsoleArguments = {};

		let matches = commandPattern.exec(commandString);

		if (matches) {

			if (matches && matches[2]) {
				subcommands = matches[2].trim().split(' ');
			}

			if (matches && matches[3]) {
				const argumentPatternParts = /[ ]*-([\w]+)(?:="(.+?)")?/g;
				const argumentPattern = /[ ]*-([\w]+)(?:=(".+?"))?/;

				let argumentStrings = matches[3].match(argumentPatternParts);

				for (let argumentString of argumentStrings) {
					let argumentMatch = argumentString.match(argumentPattern);
					if (!argumentMatch) {
						continue;
					}

					commandArguments[argumentMatch[1]] = {
						name: argumentMatch[1],
						value: argumentMatch[2] ? JSON.parse(argumentMatch[2]) : true,
					};
				}
			}
		}

		this.command = command;
		this.subcommands = subcommands;
		this.arguments = commandArguments;

		return this;
	}
}

export class WebConsole extends CcHTMLElement {
	output: HTMLPreElement = null;
	input: HTMLInputElement = null;
	inputButton: HTMLButtonElement = null;
	closeButton: HTMLButtonElement = null;
	helpButton: HTMLButtonElement = null;
	contentObject: HTMLDivElement = null;
	commandHistory: Array<string> = [];
	commandHistoryIndex: number = 0;
	commandHistoryMaxLength: number = 50;

	plugins: WebConsolePluginStore = {};

	commands: WebConsoleCommandTargets = {};

	autocompleteTabCounter = 0;
	autocompleteTabCounterTimeout = 200;

	mode: string = 'normal';
	inputBuffer: Array<string> = [];
	inputPromiseResolve: Function = null;

	captureInputTarget: CallableFunction = null;

	bootCommands: Array<string> = [];

	isTyping: boolean = false;
	typingBuffer: { text: string, resolve: Function }[] = [];

	constructor() {
		super({ html, css });

		this.onCommand = this.onCommand.bind(this);
		this.changeMode = this.changeMode.bind(this);
		this.requestInput = this.requestInput.bind(this);
		this._resolveInputBuffer = this._resolveInputBuffer.bind(this);

		this.init = this.init.bind(this);
		this.print = this.print.bind(this);
		this.printLn = this.printLn.bind(this);
		this.typeLn = this.typeLn.bind(this);
		this.clear = this.clear.bind(this);

		MessageQueue.functionPrint = this.printLn;
		MessageQueue.functionType = this.typeLn;

		MessageQueue.console = this;
	}

	static get observedAttributes(): Array<string> {
		// a list of attributes that should be observed
		return [];
	}

	async pause(ms: number): Promise<boolean> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, ms);
		});
	}

	registerBootCommand(command: string) {
		this.bootCommands.push(command);
	}

	runBootCommands() {
		for (let command of this.bootCommands) {
			this.onCommand(new WebConsoleCommand(command));
		}
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string): boolean {
		if (oldValue === newValue) {
			return true;
		}

		let result: boolean = false;
		if (name === 'selected') {
			result = true;
		}

		return result;
	}

	componentDidMount() {
		this.contentObject = this._shadowRoot.querySelector('.content');
		this.output = this._shadowRoot.querySelector('[data-for="output"]') as HTMLPreElement;
		this.input = this._shadowRoot.querySelector('input[data-action="input"]') as HTMLInputElement;
		this.inputButton = this._shadowRoot.querySelector('button[data-action="inputButton"]') as HTMLButtonElement;

		if (this.inputButton) {
			this.inputButton.addEventListener('click', this._resolveInputBuffer);
		}
		this.closeButton = this._shadowRoot.querySelector('button[data-action="close"]') as HTMLButtonElement;
		if (this.closeButton) {
			this.closeButton.addEventListener('click', this.init);
		}

		this.helpButton = this._shadowRoot.querySelector('button[data-action="help"]') as HTMLButtonElement;
		if (this.helpButton) {
			this.helpButton.addEventListener('click', () => {
				this.onCommand(new WebConsoleCommand('help'));
			});
		}

		this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
		this._shadowRoot.addEventListener('click', (e) => {
			let target = e.target as HTMLElement;

			if (target.dataset.nofocus !== undefined || target.classList.contains('output') || target.classList.contains('input')) {
				return;
			}
			this.input.focus();
			return;
		});

		const versionSpan = this._shadowRoot.querySelector('[data-source="version"]') as HTMLSpanElement;
		if (versionSpan !== null) {
			versionSpan.innerText = version;
		}

		this.contentObject.addEventListener('click', (e) => {
			if (e.target) {
				let target = e.target as HTMLElement;

				if (target.dataset.command) {
					e.preventDefault();
					e.stopPropagation();
					this.onCommand(new WebConsoleCommand(target.dataset.command));
				} else if (target.dataset.run !== undefined) {
					e.preventDefault();
					e.stopPropagation();

					this.onCommand(new WebConsoleCommand(target.innerText));
				} else if (target.dataset.type !== undefined) {
					e.preventDefault();
					e.stopPropagation();

					this.input.value = target.innerText;
					this.input.focus();
				} else if (target.dataset.copy !== undefined) {
					e.preventDefault();
					e.stopPropagation();
					let text = target.innerText;
					let textArea = document.createElement('textarea');
					textArea.value = text;
					document.body.appendChild(textArea);
					textArea.select();
					document.execCommand('copy');
					document.body.removeChild(textArea);

					this.printLn('Copied text to Clipboard', { class: 'success' });
				}
			}
		});

		this.init();
	}

	changeMode(mode: 'normal' | 'input') {
		this.unblockInput();
		if (mode === 'input') {
			this.input.parentElement.classList.add('inputMode');
			this.inputButton.innerText = 'Enter';
			this.mode = 'input';
			this.inputButton.style.display = 'inline';
		} else {
			this.input.parentElement.classList.remove('inputMode');
			this.mode = 'normal';
			this.inputButton.style.display = 'none';
		}
	}

	blockInput() {
		this.input.disabled = true;
		this.inputButton.disabled = true;
	}

	unblockInput() {
		this.input.disabled = false;
		this.inputButton.disabled = false;
		this.input.focus();
	}

	captureInput(handlerFunction: CallableFunction) {
		this.captureInputTarget = handlerFunction;
		this.changeMode('normal');
	}

	releaseInput() {
		this.captureInputTarget = null;
	}

	async requestInput() {
		return new Promise((resolve) => {
			this._resolveInputBuffer();
			this.changeMode('input');
			this.inputPromiseResolve = resolve;
		});
	}

	_resolveInputBuffer() {
		if (this.inputPromiseResolve !== null) {
			this.inputPromiseResolve(this.inputBuffer.join(' '));
		}
		this.inputPromiseResolve = null;
		this.inputBuffer = [];
		this.changeMode('normal');
	}

	getDomain() {
		return window.location.hostname;
	}

	init() {
		this.commandHistory = localStorage.getItem('commandHistory') ? JSON.parse(localStorage.getItem('commandHistory')) : [];

		this.clear();
		this.printLn(`Welcome to the WebConsole on ${this.getDomain()}`, { class: 'info title' });
		this.printLn('Type "<span data-run>help</span>" for a list of available commands.', { html: true });
		this.printLn('Remember all commands are case-sensitive.');

		this.runBootCommands();

		this.input.focus();
	}

	cleanCommandOptions(options: WebConsoleCommandOptions): WebConsoleCommandOptions {
		if (options.hidden === undefined) {
			options.hidden = false;
		}
		return options;
	}

	registerCommand(command: string, plugin: WebConsolePlugin, callback: Function, options: WebConsoleCommandOptions = {}) {
		this.commands[command] = {
			plugin: plugin,
			callback: callback,
			options: options,
		};
	}

	addToCommandHistory(commandString: string) {
		if (this.commandHistory.indexOf(commandString) === -1) {
			this.commandHistory.push(commandString);
		} else {
			this.commandHistory.splice(this.commandHistory.indexOf(commandString), 1);
			this.commandHistory.push(commandString);
		}
		this.commandHistoryIndex = 0;
		while (this.commandHistory.length > this.commandHistoryMaxLength) {
			this.commandHistory.shift();
		}
		localStorage.setItem('commandHistory', JSON.stringify(this.commandHistory));
	}

	moveCommandHistoryIndex(offset: number) {
		this.commandHistoryIndex += offset;
		if (this.commandHistoryIndex < 0) {
			this.commandHistoryIndex = 0;
		}
		if (this.commandHistoryIndex > this.commandHistory.length) {
			this.commandHistoryIndex = this.commandHistory.length;
		}
		if (this.commandHistoryIndex === 0) {
			this.input.value = '';
		} else {
			this.input.value = this.commandHistory[this.commandHistory.length - this.commandHistoryIndex];
		}
	}

	getCommandHistory(count: number) {
		let history = this.commandHistory.slice(count * -1).reverse();
		return history;
	}

	onInputKeyDown(e: KeyboardEvent) {
		if (this.mode === 'input') {
			this.onInputKeyDownHandlerInput(e);
		} else {
			this.onInputKeyDownHandlerNormal(e);
		}
	}

	onInputKeyDownHandlerInput(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			this.inputBuffer.push(this.input.value + '\n');
			this.printLn(this.input.value, { direction: 'input' });
			this.input.value = '';

			if (e.shiftKey) {
				this._resolveInputBuffer();
			}
		} else if (e.key === 'Backspace' && this.input.value.length === 0 && this.inputBuffer.length > 0) {
			e.preventDefault();
			e.stopPropagation();
			this.removeLines(1);
			this.input.value = this.inputBuffer.pop();
		}
	}

	onInputKeyDownHandlerNormal(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			this.commandHistoryIndex = 0;
			const commandString = this.input.value;
			this.input.value = '';
			let command = null;
			try {
				command = new WebConsoleCommand(commandString);
				this.onCommand(command);
			} catch (err) {
				this.printLn(`syntax error: ${err.message}`, { class: 'error' });
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			this.moveCommandHistoryIndex(1);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			this.moveCommandHistoryIndex(-1);
		} else if (e.key === 'Tab') {
			e.preventDefault();
			e.stopPropagation();
			this.autocomplete();
		}
	}

	getCommands(): Array<string> {
		const commands = [];
		for (let command in this.commands) {
			if (!this.commands[command].options.hidden) {
				commands.push(command);
			}
		}
		return commands.sort();
	}

	async onCommand(command: WebConsoleCommand) {
		if (this.captureInputTarget !== null) {
			return this.captureInputTarget(command.getStringRaw());
		} else if (this.input.disabled) {
			return false;
		}
		this.addToCommandHistory(command.getString());

		this.printLn(command.getString(), { direction: 'input' });

		try {
			if (this.commands[command.command]) {
				if (this.commands[command.command].options.blocking) {
					this.input.disabled = true;
				}
				await this.commands[command.command].callback(command);

			} else {
				this.printLn(`Command '${command.command}' not found.`, { class: 'warn' });
			}
		} catch (err) {
			this.printLn(`😱 Error: ${err.message}`, { class: 'error' });
			console.error(err);
		}
		if (this.input.disabled) {
			this.input.disabled = false;
		}
		this.input.focus();
	}

	autocomplete() {
		this.autocompleteTabCounter++;
		setTimeout(() => {
			this.autocompleteTabCounter--;
		}, this.autocompleteTabCounterTimeout);

		const command = new WebConsoleCommand(this.input.value);
		let autocompleteResult: WebConsoleAutocompleteResponse = null;

		const plugin = this.getPlugin(command.command);

		if (command.subcommands === null && !plugin) {
			const options = this.getCommands();
			autocompleteResult = this.autocompleteFromOptions(options, command.command);
			if (autocompleteResult.numberResults > 0) {
				this.input.value = autocompleteResult.result;
			}
			if (autocompleteResult.numberResults === 1) {
				this.input.value += ' ';
			}
		} else {
			if (plugin) {
				const pluginOptions = plugin.autocompleteOptionsForCommand(command);
				autocompleteResult = this.autocompleteFromOptions(pluginOptions, command.lastSubcommand());
				if (autocompleteResult.numberResults > 0) {
					command.lastSubcommand(autocompleteResult.result);
					this.input.value = command.getString();
				}
				if (command.lastSubcommand() === '') {
					this.input.value += ' ';
				}
			}
		}

		if (this.autocompleteTabCounter >= 2 && autocompleteResult.numberResults > 1) {
			this.printLn(`Available options: ${autocompleteResult.options.join(', ')}`, { clearKey: 'autocomplete', key: 'autocomplete', class: 'autocomplete' });
		}
	}

	autocompleteFromOptions(options: Array<string>, searchTerm: string): WebConsoleAutocompleteResponse {
		let commonPrefix: string = null;
		let optionsFiltered: Array<string> = [];
		if (searchTerm === null) {
			searchTerm = '';
		}

		if (options) {
			optionsFiltered = searchTerm === null ? options : options.filter(option => option.startsWith(searchTerm));
			//find smallest comon prefix of all options
			for (let option of optionsFiltered) {
				if (commonPrefix === null) {
					commonPrefix = option;
				} else {
					let i = 0;
					while (i < commonPrefix.length && i < option.length && commonPrefix[i] === option[i]) {
						i++;
					}
					commonPrefix = commonPrefix.slice(0, i);
				}
			}

		}

		return {
			input: searchTerm,
			result: commonPrefix,
			numberResults: optionsFiltered ? optionsFiltered.length : 0,
			options: optionsFiltered,
		};
	}

	removeLines(number: number = 1) {
		for (let i = 0; i < number; i++) {
			this.removeLine();
		}
	}

	removeLine() {
		this.output.removeChild(this.output.lastChild);
	}

	print(text: string, options: WebConsolePrintOptions = {}) {
		if (!options.class) {
			options.class = '';
		} if (!options.direction) {
			options.direction = 'output';
		}
		if (!options.html) {
			options.html = false;
		}
		if (!options.key) {
			options.key = false;
		}
		if (!options.copy) {
			options.copy = false;
		}
		if (!options.clearLast) {
			options.clearLast = false;
		} else if (options.clearLast === true) {
			options.clearLast = 1;
		}

		let keyAttribute = options.key ? `data-key="${options.key}"` : '';
		let copyAttribute = options.copy ? 'data-copy' : '';

		if (!options.html) {
			text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}

		if (options.clearKey) {
			this.removeClearKey(options.clearKey);
		}

		this.output.innerHTML += `<span ${keyAttribute} ${copyAttribute} class="${options.direction} ${options.class}">${text}</span>`;

		this.contentObject.scrollTop = this.contentObject.scrollHeight;
	}

	removeClearKey(key: string) {
		let obj = null;
		do {
			obj = this.output.querySelector(`[data-key="${key}"]`);
			if (obj) {
				obj.remove();
			}
		} while (obj);
	}

	printLn(text: string, options: WebConsolePrintOptions = {}): Promise<true> {
		return new Promise((resolve) => {
			this.print(text + '\n', options);
			resolve(true);
		});
	}

	typeLn(text: string, options: WebConsolePrintOptions = {}): Promise<true> {
		return new Promise((resolve) => {
			this.typingBuffer.push({
				text: text,
				resolve: resolve,
			});
			this.startTyping();
		});
	}

	async startTyping() {
		if (this.isTyping) {
			return;
		}
		this.isTyping = true;

		while (this.typingBuffer.length > 0) {
			let item = this.typingBuffer.shift();
			await this.performTyping(item.text);
			item.resolve(true);
		}

		this.isTyping = false;
	}

	async performTyping(text: string) {
		let letters = text.split('');
		let lettersPrinted = '';
		for (let letter of letters) {
			lettersPrinted = `${lettersPrinted}${letter}`;
			this.printLn(lettersPrinted, { clearKey: 'typing', key: 'typing', html: true });
			await this.pause(Math.random() * 10 + 40);
		}
		this.printLn(text, { clearKey: 'typing', html: true });
	}

	clear() {
		this.output.innerHTML = '';
	}

	getPlugin(commandString: string): false | WebConsolePlugin {
		const commandObj = this.commands[commandString];
		if (!commandObj) {
			return false;
		}
		return commandObj.plugin;
	}

	invoke(commandString: string, targetMethod: string, command: WebConsoleCommand) {
		const plugin = this.getPlugin(commandString);
		if (!plugin) {
			return false;
		}
		if (targetMethod === 'help') {
			return plugin.help(command);
		} else {
			this.printLn(`Invoking ${commandString} ${targetMethod} failed`, { class: 'error' });
			return false;
		}
	}
}

window.customElements.define('web-console', WebConsole);