ScriptLoader.module(function() {
	function drawText(context, text, size, align, needStroke) {
		context.font = 'normal ' + size + 'em Trebuchet';
		context.textAlign = align;
		context.textBaseline = 'middle';
		context.fillText(text, 0, 0);

		if (needStroke) {
			context.strokeText(text, 0, 0);
		}
	};

	function renderTexts(context, geometries, params) {
		// set params
		var color = params.color;
		context.fillStyle = color.primary;
		context.strokeStyle = color.secondary;

		for (var i = 0; i < geometries.length; i++) {
			var geometry = geometries[i];
			var data = geometry.data;

			context.save();
			context.lineWidth = data.border.width;

			var transform = geometry.transform;
			context.translate(transform.x, transform.y);

			drawText(context, data.text, data.size, data.align, (data.border.width > 0));

			context.restore();
		}
	}

	return {
		'default': function(canvas, time, deltaTime, geometries, params) {
			renderTexts(canvas.context, geometries, params);
		}
	};
});