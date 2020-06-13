const appendToGamut = (gamut, pitch) => {
	gamut.push(pitch);
	gamut.sort();
}

const removeFromGamut = (gamut, pitch) => {
	for (var idx = 0; idx < gamut.length; idx++) {
		if (gamut[idx] == pitch) {
			gamut.splice(idx, 1);
		}
	}
}

exports.appendToGamut = appendToGamut;
exports.removeFromGamut = removeFromGamut;
