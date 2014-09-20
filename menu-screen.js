var MenuScreen = (function(exports) {
	var BUTTON_SIZE = Size.make(200, 140);

	function oscillate(frequency, amplitude, setter) {
		return function(time, component) {
			var value = amplitude * Math.sin(frequency * time / (2 * Math.PI));
			return setter(component, value);
		};
	}

	function createTitle(width) {
		var title = 'TWINKLE';
		var charWidth = 90;
		var start = 0.5 * (width - title.length * charWidth);

		var res = [];
		for (var i = 0; i < title.length + 1; i++) {
			var pos = Point.make(start + (i + 0.5) * charWidth, 75);
			var starPos = Point.make(pos.x - 0.5 * charWidth, pos.y);

			res.push(UIUtils.animatedStar('titleStar' + i, starPos, 0, charWidth * 0.15, 2, 
				Math.random()));
			res.push({
				id: 'title' + i,
				pos: pos,
				geometry: {
					type: 'text',
					text: title.charAt(i),
					size: 5,
					align: 'center',
					border: 0
				},
				color: Colors.TITLE_TEXT,
				z: 1
			});
		}
		return res;
	}
	var scoreAndLevel = { score: 0, level: { starCount: 3, seed: Date.now() } };

	exports.init = function(canvas) {
		var startWithHelp = Button.make('StartWithHelp',
			Point.make(400, 280),
			BUTTON_SIZE,
			'Start with help', 
			function() {
				return {
					'$term': Utils.setPropObj(scoreAndLevel, 'help', true)
				};
			});
		var startWithoutHelp = Button.make('StartWithoutHelp',
			Point.make(400, 510),
			BUTTON_SIZE,
			'Start without help',
			function() {
				return {
					'$term': scoreAndLevel
				};
			});

		var world = Entity.accumulator()
		.add(startWithHelp)
		.add(startWithoutHelp)
		.add(createTitle(canvas.width))
		.apply(Entity.initSystem('pos', 'geometry', 'color', 'highlighted', 'highlightable',
			'target', 'z', 'button', 'animation'));

		return {
			screen: DefaultScreen.make([
					AnimationSystem,
					HighlightSystem,
					ButtonSystem,
					MovementSystem
				]),
			state: world
		};
	};

	return exports;
})(MenuScreen || {});