import html from './index.html';
import css from './style.scss';

import { CcHTMLElement } from '../CcHTMLElement';
import WebConsolePlugin from '../WebConsolePlugin';
import { WebConsolePluginStore, WebConsoleCommandTargets, WebConsoleCommand, WebConsoleArguments, WebConsolePrintOptions } from './types';

const PACKAGE = require('../../../package.json');
const version = PACKAGE.version;

export default class WebConsole extends CcHTMLElement {
	output: HTMLPreElement = null;
	input: HTMLInputElement = null;
	closeButton: HTMLButtonElement = null;
	helpButton: HTMLButtonElement = null;
	contentObject: HTMLDivElement = null;

	plugins: WebConsolePluginStore = {};

	commands: WebConsoleCommandTargets = {};

	constructor() {
		super({ html, css });

		this.onCommand = this.onCommand.bind(this);

		this.init = this.init.bind(this);
		this.print = this.print.bind(this);
		this.printLn = this.printLn.bind(this);
		this.clear = this.clear.bind(this);
	}

	static get observedAttributes(): Array<string> {
		// a list of attributes that should be observed
		return [];
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
		this.closeButton = this._shadowRoot.querySelector('button[data-action="close"]') as HTMLButtonElement;
		if (this.closeButton) {
			this.closeButton.addEventListener('click', this.init);
		}
		this.helpButton = this._shadowRoot.querySelector('button[data-action="help"]') as HTMLButtonElement;
		
		if (this.helpButton) {
			this.helpButton.addEventListener('click', ()=>{
				this.onCommand(this._getCommandParts('help'));
			});
		}
		
		this.input.addEventListener('keydown', this.onInputChange.bind(this));
		this._shadowRoot.addEventListener('click', (e) => {
			this.input.focus();
		});

		const versionSpan = this._shadowRoot.querySelector('[data-source="version"]') as HTMLSpanElement;
		if (versionSpan !== null) {
			versionSpan.innerText = version;
		}

		this.contentObject.addEventListener('click',(e) => {
			if(e.target){
				  let target = e.target as HTMLElement;
				  if (target.dataset.command) {
					  e.preventDefault();
					  e.stopPropagation();
					  this.onCommand(this._getCommandParts(target.dataset.command));
				  }
			 }
		 });
		

		this.plugins = this._getPlugins();

		this.init();
	}
	
	getCommand(options: any): WebConsoleCommand {
		let command = {
			string: '',
			command: '',
			subcommands: null,
			arguments: {},
		} as WebConsoleCommand;

		if (options.command) {
			command.command = options.command;
		}
		if (options.subcommands) {
			command.subcommands = options.subcommands;
		}
		if (options.arguments) {
			command.arguments = options.arguments;
		}

		command.string = command.command;
		if (command.subcommands) {
			command.string += ' ' + command.subcommands.join(' ');
		}
		if (command.arguments) {
			command.string += ' ' + Object.keys(command.arguments).map((key) => {
				return `${key}=${JSON.stringify(command.arguments[key])}`;
			}).join(' ');
		}

		return command;
	}

	getDomain() {
		return window.location.hostname;
	}

	init() {
		this.clear();
		this.printLn(`Welcome to the WebConsole on ${this.getDomain()}`, { class: 'info title' });
		this.printLn('Type "<span data-command="help">help</span>" for a list of available commands.', {html: true});
		this.printLn('Remember all commands are case-sensitive.');

		this.input.focus();
	}

	_getPlugins(): WebConsolePluginStore {
		let pluginStore: WebConsolePluginStore = {};
		let plugins = this.getSlotNodes() as Array<WebConsolePlugin>;
		plugins = plugins.filter((node) => {
			return node.register !== undefined;
		});

		for (let plugin of plugins) {
			pluginStore[plugin.name] = plugin;
			plugin.register(this);
		}
		return pluginStore;
	}

	_getCommandParts(command: string): WebConsoleCommand {
		const commandPattern = /^([\w]+)((?: [\w]+)+)?((?:[ ]*-[\w]+(?:="[^"]+?")?)+)?$/;
		let matches = commandPattern.exec(command);

		let subcommands = null;
		if (matches[2]) {
			subcommands = matches[2].trim().split(' ');
		}

		const commandArguments: WebConsoleArguments = {};
		if (matches[3]) {
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

		return {
			string: command,
			command: matches[1],
			subcommands: subcommands,
			arguments: commandArguments,
		};
	}

	registerCommand(command: string, plugin: WebConsolePlugin, callback: Function) {
		this.commands[command] = {
			plugin: plugin,
			callback: callback,
		};
	}

	onInputChange(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			const commandString = this.input.value;
			this.input.value = '';
			let command = null;
			try {
				command = this._getCommandParts(commandString);
				this.onCommand(command);
			} catch (err) {
				this.printLn(`syntax error: ${err.message}`, { class: 'error' });
			}
		}
	}

	getCommands() {
		let commands = Object.keys(this.commands).sort();
		return commands;
	}

	onCommand(command: WebConsoleCommand) {
		this.printLn(command.string, { direction: 'input' });
		
		console.log('onCommand', command);
		try {
			if (this.commands[command.command]) {
				this.commands[command.command].callback(command);
			} else {
				this.printLn(`Command '${command.command}' not found.`, { class: 'warn' });
			}
		} catch (err) {
			this.printLn(`😱 Error: ${err.message}`, { class: 'error' });
		}

		this.input.focus();
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

		if (!options.html) {
			text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		this.output.innerHTML += `<span class="${options.direction} ${options.class}">${text}</span>`;

		this.contentObject.scrollTop = this.contentObject.scrollHeight;
	}

	printLn(text: string, options: WebConsolePrintOptions = {}) {
		this.print(text + '\n', options);
	}

	clear() {
		this.output.innerHTML = '';
	}

	getPlugin(commandString: string): false | WebConsolePlugin {
		const commandObj = this.commands[commandString];
		if (!commandObj) {
			this.printLn(`Command '${commandString}' not found.`, { class: 'warn' });
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