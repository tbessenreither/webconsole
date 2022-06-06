const otters = [
'(:ᘌꇤ⁐ꃳ'
];

export default () => {
	//return random otter
	return otters[Math.floor(Math.random() * otters.length)];
}