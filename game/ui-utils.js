var UIUtils = (function(exports) {

	exports.getMouseOffsets = function(mousePos, positions, sizes, geometries, acceptables) {
		var inside = Utils.filterObj(acceptables, function(id) {
			return Geom.pointInside(mousePos, positions[id], sizes[id], geometries[id]);
		});
		return Utils.mapObj(inside, function(id) {
			var pos = positions[id];
			return Point.make(pos.x - mousePos.x, pos.y - mousePos.y);
		});	
	};

	exports.animatedCloud = function(id, pos, size, z, seed, cloudParts) {
		var prng = new Math.seedrandom(seed);

		cloudParts = cloudParts || 8;
		var cloudCircles = Geom.createCloud(cloudParts, prng());

		var radiusAnimationParams = [];
		for (var i = 0; i < cloudParts; i++) {
			var circle = cloudCircles[i];
			circle.amplitude = prng() * 0.05 + 0.05;
			circle.frequency = prng() * 0.03 + 0.09;
			circle.offset = prng() * 10;
		}

		return {
			id: 'cloud' + id,
			pos: pos,
			size: {
				x: size.x,
				y: size.y
			},
			geometry: {
				type: 'cloud',
				circles: cloudCircles,
				border: 5
			},
			material: {
				color: Colors.BUTTON.normal,
				renderScript: {
					id: 'game/assets/render-scripts/cloud.js',
					mode: 'animated'
				}
			},
			z: z
		};
	};

	exports.animatedStar = function(id, pos, z, radius, border, seed) {
		var prng = new Math.seedrandom(seed);

		var starPoints = Geom.createStar(Math.floor(prng() * 5) + 5);

		var frequency = prng() * 0.5 + 0.5;
		var offset = prng() * 10;
		for (var i = 0; i < starPoints.length; i++) {
			var point = starPoints[i];
			point.amplitude = prng() * 0.1 + 0.3;
			point.frequency = frequency;
			point.offset = offset;
		}

		return {
			id: id,
			pos: pos,
			z: z,
			geometry: {
				type: 'star',
				radius: radius,
				points: starPoints,
				border: {
					width: border,
					amplitude: prng() * 0.3 + 0.6,
					frequency: prng() * 0.05 + 0.15,
					offset: 0
				}
			},
			material: {
				color: Colors.STAR,
				renderScript: {
					id: 'game/assets/render-scripts/star.js',
					mode: 'animated'
				}
			}
		};
	};

	return exports;
})(UIUtils || {});