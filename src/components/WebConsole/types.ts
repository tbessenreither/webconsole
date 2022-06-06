import WebConsolePlugin from '../WebConsolePlugin';

export type WebConsolePluginStore = {
	[key: string]: WebConsolePlugin;
};

export type WebConsoleArguments = {
	[key: string]: {
		name: string;
		value: any;
	}
};

export type WebConsoleCommand = {
	string: string,
	command: string,
	subcommands: Array<string>,
	arguments: WebConsoleArguments,
};

export type WebConsoleCommandTargets = {
	[key: string]: {
		plugin: WebConsolePlugin;
		callback: Function;
	};
};

export type WebConsolePrintOptions = {
	class?: string;
	html?: boolean;
	direction?: 'input' | 'output';
};