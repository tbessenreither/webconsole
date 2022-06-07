
export type CcElementConstructorProperties = {
	css: string;
	html: string;
};

export class CcHTMLElement extends HTMLElement {
	_shadowRoot: ShadowRoot = null;
	_template: HTMLTemplateElement | false = null;
	_container: HTMLElement = null;
	_mounted:boolean = false;
	
	constructor(props: CcElementConstructorProperties) {
		super();

		this._shadowRoot = this.attachShadow({ mode: 'open' });
		if (props.css) { this.loadStyle(props.css); }
		if (props.html) { this.loadTemplate(props.html); }
	}

	isMounted() {
		return this._mounted;
	}

	loadStyle(css: string) {
		const style = document.createElement('style');
		style.innerHTML = css.trim();
		this._shadowRoot.appendChild(style);
	}

	loadTemplate(htmlTemplate: string) {
		try {
			const template = document.createElement('template');
			template.innerHTML = htmlTemplate;
			this._template = template;

			const templateNodeCopy = this._template.content.cloneNode(true) as HTMLElement;
			this._container = templateNodeCopy.querySelector(':not(style)');

			this._shadowRoot.appendChild(templateNodeCopy);

		} catch (error) {
			console.error('template loading error', error);
			this._template = false;
		}
	}

	connectedCallback(): void {
		setTimeout(() => {
			this.componentDidMount();
		}, 0);
		this._mounted = true;

		let slots = this._container.querySelectorAll('slot');
		for (let slot of slots) {
			slot.addEventListener('slotchange', this.slotDidChange.bind(this, slot));
		}
	}

	disconnectedCallback(): void {
		this._mounted = false;
		this.componentWillUnmount();
	}

	reload() {
		this.componentWillUnmount();
		this.componentDidMount();
	}

	componentDidMount(): void { }

	componentWillUnmount(): void { }

	slotDidChange(slot: HTMLSlotElement): void { }


	getSlotNodes(name?: string): Array<Node> {
		let selector: string = `slot`;
		if (name) {
			selector += `[name="${name}"]`;
		} else {
			selector += `:not([name])`;
		}

		let slot: HTMLSlotElement = this._shadowRoot.querySelector(selector);

		if (!slot) {
			return [];
		}

		return slot.assignedNodes();
	}
}

