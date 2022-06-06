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

export type WebConsoleCommandTargets = {
	[key: string]: {
		plugin: WebConsolePlugin;
		callback: Function;
		options: WebConsoleCommandOptions;
	};
};

export type WebConsolePrintOptions = {
	class?: string;
	html?: boolean;
	direction?: 'input' | 'output';
	copy?: boolean;
	clearLast?: boolean | number;
	clearKey?: string;
	key?: false | string;
};

export type WebConsoleCommandOptions = {
	hidden?: boolean;
};

export type WebConsoleAutocompleteResponse = {
	input: string,
	result: string,
	numberResults: number,
	options: Array<string>,
}