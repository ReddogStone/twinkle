var FinalState = (function(exports) {
	var BUTTON_SIZE = Size.make(150, 100);
	var FIREWORK_COUNT = 100;
	var FIREWORK_RADIUS = 10;
	var FIREWORK_DURATION = 3;

	function createDecorationStarAnimation(width, height, v, speed) {
		return [{
			type: 'pos',
			apply: function(time, pos) {
				var prng = new Math.seedrandom(Math.floor(time / FIREWORK_DURATION));
				var t = time % FIREWORK_DURATION;
				var startX = prng() * width;
				var startY = prng() * height;
				var x = startX + v.x * t;
				var y = startY + v.y * t + 100 * t * t;
				return Point.make(x, y);
			}
		}, {
			type: 'color',
			apply: function(time, color) {
				var prng = new Math.seedrandom(Math.floor(time / FIREWORK_DURATION));
				var newColor = 'rgb(' + Math.floor(prng() * 127 + 128) + ',' + 
					Math.floor(prng() * 127 + 128) + ',' + 
					Math.floor(prng() * 127 + 128) + ')';
				return Utils.mergeObjects(color, { primary: newColor });
			}
		}];
	}

	function createFireworks(width, height, seed) {
		return function() {
			var prng = new Math.seedrandom(seed);

			var accumulator = Entity.start();
			for (var i = 0; i < FIREWORK_COUNT; i++) {
				var angle = -i / FIREWORK_COUNT * 2 * Math.PI;
				var s = Math.sin(angle);
				var c = Math.cos(angle);
				var v = prng() * 80 + 20;

				accumulator = accumulator.bind(Entity.add({
					id: 'decorationStar' + i,
					pos: Point.make(0, 0),
					z: 0,
					geometry: {
						type: 'star',
						radius: FIREWORK_RADIUS,
						border: 0,
						points: Geom.createStar(10, prng())
					},
					color: {
						primary: 'rgb(' + Math.floor(prng() * 127 + 128) + ',' + 
							Math.floor(prng() * 127 + 128) + ',' + 
							Math.floor(prng() * 127 + 128) + ')',
						secondary: 'black'
					},
					animation: createDecorationStarAnimation(width, 0.2 * height, Point.make(c * v, s * v))
				}));
			}

			return accumulator;
		};
	}

	exports.init = function(canvas, world, score) {
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

		var scoreFeedback = '';
		if (score < 30) {
			scoreFeedback = ['You should try again for better score']
		} else if (score < 60) {
			scoreFeedback = ['Hey, you are smart, but you could do even better'];
		} else if (score < 94) {
			scoreFeedback = ['Outstanding! It\'s almost the perfect score.'];
		} else {
			scoreFeedback = ['PERFECT!!!', 'You did it, you\'ve beat the game!'];
		}

		var accumulator = Entity.start();
		world = accumulator
		.bind(TextHelper.addLines([
			'Congratulations',
			'You have completed all levels.',
			'Your total score is:',
			'' + score,
			''
		].concat(scoreFeedback)))
		.bind(Button.add('Back', Point.make(400, 500), BUTTON_SIZE, 'Return to Menu', function() {
			return MenuState.init;
		}))
		.bind(createFireworks(canvas.width, canvas.height))
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
})(FinalState || {});