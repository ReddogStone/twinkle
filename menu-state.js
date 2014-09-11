var MenuState = (function(exports) {
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

		return function() {
			var accumulator = Entity.start();
			for (var i = 0; i < title.length + 1; i++) {
				var pos = Point.make(start + (i + 0.5) * charWidth, 75);
				var starPos = Point.make(pos.x - 0.5 * charWidth, pos.y);

				accumulator = accumulator
				.bind(Entity.add(UIUtils.animatedStar('titleStar' + i, starPos, 0, charWidth * 0.15, 2, 
					Math.random())))
				.bind(Entity.add({
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
				}));
			}
			return accumulator;
		};
	}

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
		.bind(Button.add('StartWithHelp', Point.make(400, 280), BUTTON_SIZE, 'Start with help', function() {
			return HelpState.init;
		}))
		.bind(Button.add('StartWithoutHelp', Point.make(400, 510), BUTTON_SIZE, 
			'Start without help', function() {
			return function(canvas, world) {
				return GameState.firstLevel(canvas, world);
			}
		}))
		.bind(createTitle(canvas.width))
		.execState(world);

		return {
			world: world,
			onMouseDown: function(mousePos, world) {
				return {
					world: DefaultState.onMouseDown(mousePos, world)
				};
			},
			onMouseUp: function(mousePos, world) {
				var res = DefaultState.onMouseUp(mousePos, world);
				var answer = Utils.firstObj(res.buttonEvents, function() { return true; });
				if (answer) {
					Sound.play('select');
					return {
						next: answer
					};
				}
				return {
					world: res.world
				};
			},
			onMouseMove: DefaultState.onMouseMove,
			frame: DefaultState.frame
		};
	};

	return exports;
})(MenuState || {});