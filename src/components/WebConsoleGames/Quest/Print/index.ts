import { PrintConfig } from "./types";
import MessageQueue from "../../../WebConsole/MessageQueue";
import { WebConsolePrintOptions } from "../../../WebConsole/types";
import { MessageQueueMethods } from "../../../WebConsole/MessageQueue/types";


class Print {

	static Type(text: string, settings: WebConsolePrintOptions = {}): void {
		if (!settings.html) {
			settings.html = true;
		}
		MessageQueue.add({
			text: text,
			method: MessageQueueMethods.type,
			settings: settings,
		});
	}

	static Line(text: string, settings: WebConsolePrintOptions = {}) {
		if (!settings.html) {
			settings.html = true;
		}
		MessageQueue.add({
			text: text,
			method: MessageQueueMethods.print,
			settings: settings,
		});
	}

	static Message(config: PrintConfig): void {
		if (!config.method) {
			config.method = MessageQueueMethods.print;
		}

		if (config.method === MessageQueueMethods.print) {
			Print.Line(config.text, config.settings);
		} else if (config.method === MessageQueueMethods.type) {
			Print.Type(config.text, config.settings);
		}
	}
}

export default Print;

