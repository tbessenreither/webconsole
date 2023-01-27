export function capitalizeFirstLetter(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function joinSentences(sentences: string[]): string {
	return sentences.join('. ') + '.';
}

export function joinWithCommaAndAnd(items: string[]): string {
	if (items.length === 0) {
		return '';
	}

	if (items.length === 1) {
		return items[0];
	}

	if (items.length === 2) {
		return `${items[0]} und ${items[1]}`;
	}

	let lastItem = items.pop();
	return `${items.join(', ')}, und ${lastItem}`;
}