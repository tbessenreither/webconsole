import WebConsolePlugin from "../WebConsolePlugin";
import WebConsole from "../WebConsole";
import { WebConsoleCommand } from "../WebConsole/types";

export default class WebConsoleWhy extends WebConsolePlugin {
	_console: WebConsole = null;
	name: string = 'Why';

	onRegister() {
		this._console.registerCommand('why', this, this.why.bind(this));
		this._console.registerCommand('longline', this, this.longline.bind(this), {hidden: true});
	}

	why() {
		this.printLn(``);
		this.printLn(`Du fragst "Warum?"`);
		this.printLn(`Ich sage "Warum nicht?"`);
		this.printLn(`Normale Webseiten sind langweilig und man kann sooo viel mehr lustiges mit einem CLI anstellen.`);
		this.printLn(`Ich bin mir bewusst das so eine Seite nicht für jeden ist, aber ich mag es und wenn du es auch gut findest sind wir schon zwei.`);
		this.printLn(`Außerdem ist ein CLI irgendwie viel persönlicher, findest du nicht?`);
		this.printLn(``);
	}

	longline() {
		this.printLn(`Ich bin mir bewusst das so eine Seite nicht für jeden ist, aber ich mag es und wenn du es auch gut findest sind wir schon zweifür jeden ist, aber ich mag es und wenn du es auch gut findest sind wir schon zweifür jeden ist, aber ich mag es und wenn du es auch gut findest sind wir schon zwei.`);
	}

}

window.customElements.define('web-console-why', WebConsoleWhy);