ScriptLoader.module(function() {
	function getPointAtTime(pointParams, time) {
		var f = pointParams.frequency;
		var a = pointParams.amplitude;
		var off = pointParams.offset;
		var r = (Math.sin(f * (time - off) * (2 * Math.PI)) + 1) * 0.5 * a + 1;
		return { x: pointParams.x * r, y: pointParams.y * r };
	}

	function drawStar(context, time, radius, points, needStroke, animated) {
		context.beginPath();

		context.moveTo(points[0].x * radius, points[0].y * radius);
		for (var i = 1; i < points.length; i++) {
			var point = animated ? getPointAtTime(points[i], time) : points[i];
			context.lineTo(point.x * radius, point.y * radius);
		}
		context.closePath();

		context.fill();

		if (needStroke) {
			context.stroke();
		}
	};

	function getBorderWidthAtTime(borderParams, time) {
		var f = borderParams.frequency;
		var a = borderParams.amplitude;
		var off = borderParams.offset;
		var b = (Math.sin(f * (time - off) * (2 * Math.PI)) + 1) * 0.5 * a + 0.5;
		return borderParams.width * b;
	}

	function renderStars(context, time, geometries, params, animated) {
		// set params
		var color = params.color;
		context.fillStyle = color.primary;
		context.strokeStyle = color.secondary;

		for (var i = 0; i < geometries.length; i++) {
			var geometry = geometries[i];
			var data = geometry.data;

			context.save();
			context.lineWidth = animated ? getBorderWidthAtTime(data.border, time) : data.border.width;

			var transform = geometry.transform;
			context.translate(transform.x, transform.y);

			drawStar(context, time, data.radius, data.points, (data.border.width > 0), animated);

			context.restore();
		}
	}

	return {
		'default': function(canvas, time, deltaTime, geometries, params) {
			renderStars(canvas.context, time, geometries, params, false);
		},
		'animated': function(canvas, time, deltaTime, geometries, params) {
			renderStars(canvas.context, time, geometries, params, true);
		}
	};
});