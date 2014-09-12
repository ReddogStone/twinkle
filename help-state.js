var HelpState = (function(exports) {
	var BUTTON_SIZE = Size.make(150, 100);

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
			return function(canvas, world) {
				return GameState.firstLevel(canvas, world);
			}
		}))
		.apply(Entity.initSystem('pos', 'geometry', 'color', 'highlighted', 'highlightable',
			'target', 'z', 'button', 'animation'));

		return {
			world: world,
			onMouseDown: DefaultState.onMouseDown,
			onMouseUp: function(mousePos, world) {
				var res = DefaultState.onMouseUp(mousePos, world);
				var answer = Utils.firstObj(res.buttonEvents, function() { return true; });
				if (answer) {
					Sound.play('select');
					return {
						next: answer
					};
				}
				return res;
			},
			onMouseMove: DefaultState.onMouseMove,
			update: DefaultState.update,
			draw: DefaultState.draw
		};
	};

	return exports;
})(HelpState || {});