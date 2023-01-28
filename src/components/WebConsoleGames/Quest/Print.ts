class Print {
	static printLnFunction: any = null;
	static typeFunction: any = null;

	static setPrintLnFunction(fn: any) {
		Print.printLnFunction = fn;
	}

	static setTypeFunction(fn: any) {
		Print.typeFunction = fn;
	}

	static Type(text: string): void {
		if (Print.typeFunction) {
			Print.typeFunction(text);
		}
	}

	static Line(text: string, settings?: any) {
		if (Print.printLnFunction) {
			Print.printLnFunction(text, settings);
		}
	}
}

export default Print;

