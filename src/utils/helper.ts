/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object: object, keys: string[]): Object => {
	const res = {};
	keys.forEach(key => {
		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
			res[key as keyof typeof object] = object[key as keyof typeof object];
		}
	});

	return res;
};

export function getRandomInt(min: number, max: number) {
	const minVal = Math.ceil(min);
	const maxVal = Math.floor(max);
	return Math.floor(Math.random() * (maxVal - minVal) + minVal);
}

export function isObjectEmpty(obj: object): boolean {
	for (const x in obj) return false;

	return true;
}
