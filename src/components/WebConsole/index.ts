import html from './index.html';
import css from './style.scss';

import { CcHTMLElement } from '../CcHTMLElement';
import WebConsolePlugin from '../WebConsolePlugin';
import { WebConsolePluginStore, WebConsoleCommandTargets, WebConsoleCommand, WebConsoleArguments, WebConsolePrintOptions } from './types';



export default class WebConsole extends CcHTMLElement {
	output: HTMLPreElement = null;
	input: HTMLInputElement = null;

	plugins: WebConsolePluginStore = {};

	commands: WebConsoleCommandTargets = {};

	constructor() {
		super({ html, css });

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
		this.output = this._shadowRoot.querySelector('[data-for="output"]') as HTMLPreElement;
		this.input = this._shadowRoot.querySelector('input[data-action="input"]') as HTMLInputElement;
		this.input.addEventListener('keydown', this.onInputChange.bind(this));
		this._shadowRoot.addEventListener('click', (e) => {
			this.input.focus();
		});

		this.plugins = this._getPlugins();

		this.init();
	}

	init() {
		this.clear();
		this.printLn('Welcome to the WebConsole', { class: 'info title' });
		this.printLn('Type "help" for a list of available commands.');

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
			this.printLn(commandString, { direction: 'input' });
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

	onCommand(command: WebConsoleCommand) {
		try {
			if (this.commands[command.command]) {
				this.commands[command.command].callback(command);
			} else {
				this.printLn(`Command '${command.command}' not found.`, { class: 'warn' });
			}
		} catch (err) {
			this.printLn(`😱 Error: ${err.message}`, { class: 'error' });
		}
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