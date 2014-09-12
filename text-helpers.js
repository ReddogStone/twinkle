var TextHelper = (function(exports) {
	exports.makeLines = function(lines) {
		var res = [];
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			res.push({
				id: 'helpText' + i,
				pos: Point.make(400, 50 + i * 40),
				geometry: {
					type: 'text',
					text: line,
					size: 1.7,
					align: 'center',
					border: 0
				},
				color: { 
					primary: 'white',
					secondary: 'white',
				},
				z: 1
			});
		}
		return res;
	}

	return exports;
})(TextHelper || {});