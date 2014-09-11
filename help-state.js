var HelpState = (function(exports) {
	var BUTTON_SIZE = Size.make(150, 100);

	exports.init = function(canvas) {
		var world = {
			id: [],
			pos: {},
			geometry: {},
			color: {},
			highlighted: {},
			highlightable: {},
			target: {},
			z: {},
			button: {},
			animation: {}
		};

		var accumulator = Entity.start();
		world = accumulator
		.bind(TextHelper.addLines([
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
		.bind(Button.add('start', Point.make(400, 530), BUTTON_SIZE, 'OK, I got it', function() {
			return function(canvas, world) {
				return GameState.firstLevel(canvas, world);
			}
		}))
		.execState(world);

		return {
			world: world,
			onMouseDown: function(mousePos, world) {
				return {
					world: DefaultState.onMouseDown(mousePos, world)
				};
			},
			onMouseUp: function(mousePos, world) {
				var releasedButtons = Button.getReleased(world.button);
				world = Utils.mergeObjects(world, {
					button: Utils.mergeObjects(world.button, releasedButtons),
					color: Utils.mergeObjects(world.color,
						Button.getColors(releasedButtons, world.highlighted))
				});
				var answers = Utils.mapObj(releasedButtons, function(id, button) {
					if (world.highlighted[id] && button.onClick) {
						return button.onClick();
					}
				});
				var answer = Utils.firstObj(answers, function() { return true; });
				if (answer) {
					return {
						next: answer
					};
				}
				return {
					world: world
				};
			},
			onMouseMove: DefaultState.onMouseMove,
			frame: DefaultState.frame
		};
	};

	return exports;
})(HelpState || {});