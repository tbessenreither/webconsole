import { WebConsole } from "..";
import { MessageQueueItem, MessageQueueItemList, MessageQueueMethods } from "./types";


export default class MessageQueue {
	private static _console: WebConsole;
	private static _functions: { [key in MessageQueueMethods]: Function } = {
		[MessageQueueMethods.print]: () => { },
		[MessageQueueMethods.type]: () => { },
	};
	private static _queue: MessageQueueItemList = [];

	private static _queueIsRunning: boolean = false;

	static set console(console: WebConsole) {
		this._console = console;
	}

	static set functionPrint(callback: Function) {
		this._functions[MessageQueueMethods.print] = callback;
	}

	static set functionType(callback: Function) {
		this._functions[MessageQueueMethods.type] = callback;
	}

	public static add(message: MessageQueueItem): Promise<true> {
		if (!message.settings) {
			message.settings = {};
		}
		if (!message.settings.html) {
			message.settings.html = true;
		}

		return new Promise((resolve) => {
			message.resolve = resolve;
			this._queue.push(message);

			this._execute();
		});
	}

	private static _delayMs(ms: number): Promise<true> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, ms);
		});
	}

	private static async _execute() {
		if (this._queueIsRunning) {
			return;
		}
		this._queueIsRunning = true;
		this._console.blockInput();

		while (this._queue.length > 0) {
			const message = this._queue.shift();
			if (message && this._functions[message.method]) {
				if (message.settings && message.settings.delayMsBefore) {
					await this._delayMs(message.settings.delayMsBefore);
				}

				await this._functions[message.method](message.text, message.settings);

				if (message.settings && message.settings.delayMsAfter) {
					console.log('delayAfter');
					await this._delayMs(message.settings.delayMsAfter);
				}
				message.resolve(true);
			}
		}

		this._console.unblockInput();
		this._queueIsRunning = false;
	}
}