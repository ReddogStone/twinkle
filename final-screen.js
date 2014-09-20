var FinalScreen = (function(exports) {
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
		var prng = new Math.seedrandom(seed);

		var res = [];
		for (var i = 0; i < FIREWORK_COUNT; i++) {
			var angle = -i / FIREWORK_COUNT * 2 * Math.PI;
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			var v = prng() * 80 + 20;

			res.push({
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
			});
		}

		return res;
	}

	exports.init = function(canvas, prevScreen, prevState, finalInfo) {
		var score = finalInfo.score;
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

		var world = Entity.accumulator()
		.add(TextHelper.makeLines([
			'Congratulations',
			'You have completed all levels.',
			'Your total score is:',
			'' + score,
			''
		].concat(scoreFeedback)))
		.add(Button.make('Back', Point.make(400, 500), BUTTON_SIZE, 'Return to Menu', function() {
			return {
				'$term': {}
			};
		}))
		.add(createFireworks(canvas.width, canvas.height))
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
})(FinalScreen || {});