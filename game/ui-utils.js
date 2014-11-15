var UIUtils = (function(exports) {

	exports.getMouseOffsets = function(mousePos, positions,  geometries, acceptables) {
		var inside = Utils.filterObj(acceptables, function(id) {
			return Geom.pointInside(mousePos, positions[id], geometries[id]);
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
			radiusAnimationParams.push({
				amplitude: prng() * 0.05 + 0.05,
				frequency: prng() * 0.03 + 0.09,
				offset: prng() * 10
			});
		}

		return {
			id: 'cloud' + id,
			pos: pos,
			geometry: {
				type: 'cloud',
				sx: size.x,
				sy: size.y,
				circles: cloudCircles,
				border: 5
			},
			color: Colors.Button.NORMAL,
			highlightable: true,
			z: z,
			animation: [
				{
					type: 'geometry',
					apply: function(time, geom) {
						var newCircles = cloudCircles.map(function(circle, index) {
							var params = radiusAnimationParams[index];
							var f = params.frequency;
							var a = params.amplitude;
							var off = params.offset;
							var r = (Math.sin(f * (time + off) * (2 * Math.PI)) * a + 1) * circle.radius;
							return Utils.mergeObjects(circle, { radius: r });
						});
						return Utils.mergeObjects(geom, { circles: newCircles });
					}
				}
			]
		};
	};

	exports.animatedStar = function(id, pos, z, radius, border, seed) {
		var prng = new Math.seedrandom(seed);

		var starPoints = Geom.createStar(Math.floor(prng() * 5) + 5);
		var animationParams = [];

		var frequency = prng() * 0.5 + 0.5;
		var offset = prng() * 10;
		for (var i = 0; i < starPoints.length; i++) {
			animationParams.push({
				amplitude: prng() * 0.1 + 0.3,
				frequency: frequency,
				offset: offset
			});
		}

		borderAnimParams = {
			amplitude: prng() * 0.3 + 0.6,
			frequency: prng() * 0.05 + 0.15,
			offset: 0
		};

		return {
			id: id,
			pos: pos,
			z: z,
			geometry: {
				type: 'star',
				radius: radius,
				border: border,
				points: starPoints
			},
			color: Colors.STAR,
			animation: [{
				type: 'geometry',
				apply: function(time, geom) {
					var f = borderAnimParams.frequency;
					var a = borderAnimParams.amplitude;
					var off = borderAnimParams.offset;
					var b = (Math.sin(f * (time - off) * (2 * Math.PI)) + 1) * 0.5 * a + 0.5;
					var newPoints = starPoints.map(function(point, index) {
						var params = animationParams[index];
						var f = params.frequency;
						var a = params.amplitude;
						var off = params.offset;
						var r = (Math.sin(f * (time - off) * (2 * Math.PI)) + 1) * 0.5 * a + 1;
						return Utils.mergeObjects(point, {
							x: point.x * r,
							y: point.y * r
						});
					});
					return Utils.mergeObjects(geom, { points: newPoints, border: border * b });
				}
			}]
		};
	};

	return exports;
})(UIUtils || {});