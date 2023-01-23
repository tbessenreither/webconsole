class Print {
	static printLnFunction: any = null;

	static setPrintLnFunction(fn: any) {
		Print.printLnFunction = fn;
	}

	static Line(text: string, settings?: any) {
		if (Print.printLnFunction) {
			Print.printLnFunction(text, settings);
		}
	}
}

export default Print;

