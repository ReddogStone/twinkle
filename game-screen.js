var GameScreen = (function(exports) {
var STAR_RADIUS = 15;
	var STAR_BORDER = 2;
	var STAR_RAYS = 10;
	var CONNECTOR_WIDTH = 1;
	var Layers = {
		DECORATIONS: -1,
		CONNECTORS: 0,
		STARS: 1,
		TEXT: 20
	};
	var MAX_LEVEL = 10;
	var DECORATION_COUNT = 50;

	var END_GAME_TOP = 200;
	var END_GAME_OFF = 600;

	function beginConnection(mousePos, startId) {
		return {
			id: 'curConnector',
			z: Layers.CONNECTORS,
			halfConnector: { begin: startId, end: Point.clone(mousePos) },
			geometry: { type: 'line', width: CONNECTOR_WIDTH },
			color: Colors.CONNECTOR
		};
	}

	function createConnector(connection) {
		return {
			id: connection.begin + '->' + connection.end,
			z: Layers.CONNECTORS,
			connector: {
				begin: connection.begin,
				end: connection.end
			},
			geometry: { type: 'line', width: CONNECTOR_WIDTH },
			color: Colors.CONNECTOR
		};
	}

	function newNeighbors(connection, neighbors) {
		var addBegin = {};
		addBegin[connection.begin] = true;
		var addEnd = {};
		addEnd[connection.end] = true;

		var beginNeighbors = neighbors[connection.begin] || {};
		var endNeighbors = neighbors[connection.end] || {};

		var res = {};
		res[connection.begin] = Utils.mergeObjects(beginNeighbors, addEnd);
		res[connection.end] = Utils.mergeObjects(endNeighbors, addBegin);
		return res;
	}

	function commonNeighbor(neighbors1, neighbors2) {
		neighbors1 = neighbors1 || {};
		neighbors2 = neighbors2 || {};
		return Utils.firstKeyObj(neighbors1, function(id) {
			return neighbors2[id];
		});
	}

	function getHighlightedTriangle(id1, id2, id3) {
		var res = {};
		res[id1] = true;
		res[id2] = true;
		res[id3] = true;
		res[id1 + '->' + id2] = true;
		res[id1 + '->' + id3] = true;
		res[id3 + '->' + id2] = true;
		res[id2 + '->' + id1] = true;
		res[id3 + '->' + id1] = true;
		res[id2 + '->' + id3] = true;
		return res;
	}

	function createStars(width, height, starCount, seed) {
		var prng = new Math.seedrandom(seed);

		var res = [];
		for (var i = 0; i < starCount; i++) {
			var starPos = { 
				x: width * 0.2 + prng() * width * 0.6,
				y: height * 0.2 + prng() * height * 0.5,
			};

			var invalidPos = res.some(function(entity) {
				return (Point.dist(entity.pos, starPos) < 3 * STAR_RADIUS);
			});
			if (invalidPos) {
				i--;
				continue;
			}

			var star = UIUtils.animatedStar('star' + i, starPos, 
				Layers.STARS, STAR_RADIUS, STAR_BORDER, prng())
			.set('highlightable', true)
			.set('star', true);
			res.push(star);
		}
		return res;
	}

	function createDecorationStarAnimation(frequency, amplitude, offset) {
		return [{
			type: 'geometry',
			apply: function(time, geom) {
				var a = amplitude;
				var f = frequency * (2 * Math.PI);
				var s = 0.5 * Math.sin(f * (time - offset)) + 0.5;
				var pow = Math.pow(s, 1000);
				var r = (pow * a + 1) * STAR_RADIUS * 0.1;
				return Utils.mergeObjects(geom, { radius: r });
			}
		}];
	}

	function createDecorations(width, height, seed) {
		var prng = new Math.seedrandom(seed);

		var res = [];
		for (var i = 0; i < DECORATION_COUNT; i++) {
			var starPos = {
				x: prng() * width,
				y: prng() * height,
			};

			var off = prng() * 10;

			res.push({
				id: 'decorationStar' + i,
				pos: starPos,
				z: Layers.DECORATIONS,
				geometry: {
					type: 'star',
					radius: STAR_RADIUS * 0.1,
					border: 0,
					points: Geom.createStar(4, prng())
				},
				color: Colors.STAR,
				animation: createDecorationStarAnimation(prng() * 0.02 + 0.03, 2, off)
			});
		}

		return res;
	}

	function getLoseText() {
		return [
			{
				id: 'LoseText',
				pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP},
				z: Layers.TEXT + 1,
				geometry: { type: 'text', text: 'YOU LOSE!', size: 3, align: 'center', border: 0 },
				color: Colors.LOSE_TEXT,
				target: {x: 400, y: END_GAME_TOP}
			},
			{
				id: 'LoseText2',
				pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP + 70},
				z: Layers.TEXT + 1,
				geometry: { type: 'text', text: 'No triangles! Click to restart', size: 2, align: 'center', border: 0 },
				color: Colors.LOSE_TEXT,
				target: {x: 400, y: END_GAME_TOP + 70}
			},
			{
				id: 'loseCloud',
				pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP + 60},
				target: {x: 400, y: END_GAME_TOP + 60},
				geometry: {
					type: 'cloud',
					sx: 300,
					sy: 200,
					circles: Geom.createCloud(8, Math.random()),
					border: 5
				},
				color: Colors.LOSE_CLOUD,
				z: Layers.TEXT
			}
		];
	}

	function getWinText() {
		return [
			{
				id: 'WinText',
				pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP},
				z: Layers.TEXT + 1,
				geometry: { type: 'text', text: 'WELL DONE!', size: 3, align: 'center', border: 0 },
				color: Colors.LOSE_TEXT,
				target: {x: 400, y: END_GAME_TOP}
			},
			{
				id: 'WinText2',
				pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP + 70},
				z: Layers.TEXT + 1,
				geometry: { type: 'text', text: 'Click to continue', size: 2, align: 'center', border: 0 },
				color: Colors.LOSE_TEXT,
				target: {x: 400, y: END_GAME_TOP + 70}
			},
			{
				id: 'loseCloud',
				pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP + 60},
				target: {x: 400, y: END_GAME_TOP + 60},
				geometry: {
					type: 'cloud',
					sx: 300,
					sy: 200,
					circles: Geom.createCloud(8, Math.random()),
					border: 5
				},
				color: Colors.LOSE_CLOUD,
				z: Layers.TEXT
			}
		];
	}

	function calculateMaxConnectionCount(starCount) {
		var group1 = Math.floor(starCount * 0.5);
		var group2 = starCount - group1;
		return group1 * group2;
	}

	function draw(world, context) {
		DefaultScreen.draw(world, context);
		var currentScore = Object.keys(world.connector).length;
		Geom.drawText(context, 'Level Score: ' + currentScore,
			Point.make(670, 510), 1.3, 'center', 0, Colors.Button.TEXT.primary);
		Geom.drawText(context, 'Possible Score: ' + world.possibleScore,
			Point.make(670, 535), 1.3, 'center', 0, Colors.Button.TEXT.primary);
		Geom.drawText(context, 'Total Score: ' + (world.score + currentScore),
			Point.make(670, 560), 1.3, 'center', 0, Colors.Button.TEXT.primary);
	}

	function onEvent(world, event) {
		var value = event.value;
		switch (event.type) {
			case 'connection_started':
				return Query.addEntity(beginConnection(value.mousePos, value.startId));
			case 'connection_aborted':
				return Query.removeEntity('curConnector');
			case 'connection_closed':
				Sound.play('connect');
				var res = [
					Query.upsertComponents('neighbor', newNeighbors(value, world.neighbor)),
					Query.addEntity(createConnector(value)),
					Query.removeEntity('curConnector')
				];

				var common = commonNeighbor(world.neighbor[value.begin], world.neighbor[value.end]);
				if (common) {
					Sound.play('lose');
					res = res.concat(getLoseText().map(function(entity) { 
						return Query.addEntity(entity);
					}));
					res.push(Query.upsertComponents('highlighted', 
						getHighlightedTriangle(common, value.begin, value.end)));
					res.push(Query.event('term', { score: world.score, level: world.level }));
				}

				var maxConnectionCount = calculateMaxConnectionCount(world.level.starCount);
				var currentScore = Object.keys(world.connector).length + 1;
				if (currentScore === maxConnectionCount) {
					Sound.play('win');
					res = res.concat(getWinText().map(function(entity) { return Query.addEntity(entity); }));

					var nextLevel = undefined;
					var currentLevel = world.level;
					if (currentLevel.starCount < MAX_LEVEL) {
						nextLevel = {
							starCount: currentLevel.starCount + 1,
							seed: currentLevel.seed + 1
						};
					}
					res.push(Query.event('term', { score: world.score + currentScore, level: nextLevel }));
				}

				return res;
		}

		console.log('Unhandled event: ' + JSON.stringify(event));
		return {};
	}

	exports.firstLevel = function(canvas) {
		return exports.init(canvas, {score: 0}, { starCount: 3, seed: 10 });
	};

	exports.init = function(canvas, prevScreen, prevState, scoreAndLevel) {
		var score = scoreAndLevel.score;
		var level = scoreAndLevel.level;

		var myWorld = Entity.accumulator()
		.add(createStars(canvas.width, canvas.height, level.starCount, level.seed))
		.add(createDecorations(canvas.width, canvas.height, level.seed))
		.add(Button.make('Restart', Point.make(120, 550), Size.make(120, 90), 'Restart Level', 
			function(state) {
				return {
					'$term': { score: score, level: level, instant: true }
				};
			}, level.seed + 1))
		.add(Button.make('NextLevel', Point.make(385, 550), Size.make(120, 90), 'Next Level', 
			function(state) {
				var nextLevel = {
					starCount: level.starCount + 1,
					seed: level.seed + 1
				};
				if (nextLevel.starCount > MAX_LEVEL) {
					nextLevel = undefined;
				}
				return {
					'$term': { 
						score: score + Object.keys(state.connector).length,
						level: nextLevel,
						instant: true
					}
				};
			}, level.seed + 2))
		.add(UIUtils.animatedCloud('Score', Point.make(670, 550), Size.make(140, 100), 0, level.seed))
		.apply(Entity.initSystem('pos', 'geometry', 'color', 'velocity', 
			'draggable', 'dragOffset', 'target', 'targetRadius', 'highlighted', 'highlightable',
			'connector', 'halfConnector', 'starSet', 'neighbor', 'z', 'button', 'animation',
			'star'));

		myWorld.score = score;
		myWorld.level = level;
		myWorld.possibleScore = calculateMaxConnectionCount(level.starCount);

		return {
			screen: DefaultScreen.make([
					AnimationSystem,
					HighlightSystem,
					ButtonSystem,
					ConnectorSystem,
					MovementSystem
				], { draw: draw, onEvent: onEvent }),
			state: myWorld
		};
	};

	return exports;
})(GameScreen || {});