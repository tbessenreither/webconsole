import { WebConsolePrintOptions } from "../types";

export enum MessageQueueMethods {
	print = 'print',
	type = 'type',
};

export type MessageQueueItem = {
	text: string;
	method?: MessageQueueMethods;
	settings?: WebConsolePrintOptions;
	resolve?: Function;
};

export type MessageQueueItemList = MessageQueueItem[];