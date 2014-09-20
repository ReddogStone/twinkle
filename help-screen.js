var HelpScreen = (function(exports) {
	var BUTTON_SIZE = Size.make(150, 100);

	exports.init = function(canvas, prevScreen, prevState, termSignal) {
		var world = Entity.accumulator()
		.add(TextHelper.makeLines([
			'Welcome to Twinkle',
			'This is a game about making connections.',
			'In fact you will be connecting not only worlds',
			'but whole star systems!!!',
			'',
			'Drag a line between two stars to connect them',
			'The more connections the better, but...',
			'NEVER MAKE TRIANGLES!',
			'Triangles formed by intersecting lines are ok, though.'
		]))
		.add(Button.make('start', Point.make(400, 530), BUTTON_SIZE, 'OK, I got it', function() {
			return {
				'$term': termSignal
			};
		}))
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
})(HelpScreen || {});