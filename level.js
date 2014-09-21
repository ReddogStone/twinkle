var Level = (function(exports) {
	exports.createStarPositions = function(width, height, radius, count, seed) {
		var prng = new Math.seedrandom(seed);

		var res = [];
		for (var i = 0; i < count; i++) {
			var newPos = { 
				x: width * 0.2 + prng() * width * 0.6,
				y: height * 0.2 + prng() * height * 0.5,
			};

			var invalidPos = res.some(function(pos) {
				return (Point.dist(pos, newPos) < 3 * radius);
			});
			if (invalidPos) {
				i--;
				continue;
			}
			res.push(newPos);
		}
		return res;
	};

	return exports;
})(Level || {});