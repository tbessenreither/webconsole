import { MessageQueueMethods } from "../../../WebConsole/MessageQueue/types";
import { WebConsolePrintOptions } from "../../../WebConsole/types";


export type PrintConfig = {
	text: string;
	method?: MessageQueueMethods;
	settings?: WebConsolePrintOptions;
};