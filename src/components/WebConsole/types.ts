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
	direction?: 'input' | 'output' | 'none';
	copy?: boolean;
	clearLast?: boolean | number;
	clearKey?: string;
	key?: false | string;
	delayMsBefore?: number;
	delayMsAfter?: number;
};

export type WebConsoleCommandOptions = {
	hidden?: boolean;
	blocking?: boolean;
};

export type WebConsoleAutocompleteResponse = {
	input: string,
	result: string,
	numberResults: number,
	options: Array<string>,
}