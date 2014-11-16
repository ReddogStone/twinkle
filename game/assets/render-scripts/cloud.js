ScriptLoader.module(function() {
	function getRadiusAtTime(circleParams, time) {
		var f = circleParams.frequency;
		var a = circleParams.amplitude;
		var off = circleParams.offset;
		var r = (Math.sin(f * (time - off) * (2 * Math.PI)) + 1) * 0.5 * a + 1;
		return circleParams.radius * r;
	}

	function drawCloud(context, time, circles, radiusDelta, animated) {
		context.save();

		for (var i = 0; i < circles.length; i++) {
			var circle = circles[i];
			context.beginPath();
			var radius = animated ? getRadiusAtTime(circle, time) : circle.radius;
			context.arc(circle.x, circle.y, radius + radiusDelta, 0, Math.PI * 2, true);
			context.fill();
		}

		context.restore();
	};

	function renderClouds(context, time, geometries, params, animated) {
		// set params
		var color = params.color;

		for (var i = 0; i < geometries.length; i++) {
			var geometry = geometries[i];
			var data = geometry.data;

			context.save();

			var transform = geometry.transform;
			context.translate(transform.x, transform.y);
			context.scale(transform.sx, transform.sy);

			context.fillStyle = color.secondary;
			drawCloud(context, time, data.circles, data.border / transform.sy, animated);

			context.fillStyle = color.primary;
			drawCloud(context, time, data.circles, 0, animated);

			context.restore();
		}
	}

	return {
		'default': function(canvas, time, deltaTime, geometries, params) {
			renderClouds(canvas.context, time, geometries, params, false);
		},
		'animated': function(canvas, time, deltaTime, geometries, params) {
			renderClouds(canvas.context, time, geometries, params, true);
		}
	};
});