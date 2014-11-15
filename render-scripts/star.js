ScriptLoader.module(function() {
	function drawStar(context, radius, points, needStroke) {
		context.beginPath();

		context.moveTo(points[0].x * radius, points[0].y * radius);
		for (var i = 1; i < points.length; i++) {
			var point = points[i];
			context.lineTo(point.x * radius, point.y * radius);
		}
		context.closePath();

		context.fill();

		if (needStroke) {
			context.stroke();
		}
	};

	return function renderStars(canvas, geometries, params) {
		var context = canvas.context;

		// set params
		context.fillStyle = params.color;
		context.strokeStyle = params.borderColor;
		context.lineWidth = params.borderWidth;	

		for (var i = 0; i < geometries.length; i++) {
			var geometry = geometries[i];

			context.save();

			var transform = geometry.transform;
			context.translate(transform.x, transform.y);

			drawStar(context, geometry.data.radius, geometry.data.points, (params.borderWidth > 0));

			context.restore();
		}
	};
});