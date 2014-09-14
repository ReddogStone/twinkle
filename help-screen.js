var HelpScreen = (function(exports) {
	var BUTTON_SIZE = Size.make(150, 100);

	function onEvent(world, event) {
		switch (event.type) {
			case 'button_clicked':
				return {
					next: event.value
				};
		}

		console.log('Unhandled event: ' + JSON.stringify(event));
		return {};
	}

	exports.init = function(canvas) {
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
			return function(screen) {
				return GameScreen.firstLevel(canvas);
			}
		}))
		.apply(Entity.initSystem('pos', 'geometry', 'color', 'highlighted', 'highlightable',
			'target', 'z', 'button', 'animation'));

		return {
			world: world,
			draw: DefaultScreen.draw,
			onEvent: onEvent,
			systems: [
				AnimationSystem,
				HighlightSystem,
				ButtonSystem,
				MovementSystem
			]
		};
	};

	return exports;
})(HelpScreen || {});