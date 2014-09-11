var GameState = (function(exports) {
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

	function followTarget(deltaTime, targets, values) {
		return Utils.mapObj(targets, function(id, target) {
			var alpha = Math.pow(0.5, deltaTime);
			return alpha * values[id] + (1 - alpha) * target;
		});
	}

	function determineStarStrength(starSets) {
		var sets = Utils.transposeObj(starSets);
		return Utils.mapObj(starSets, function(id, setId) {
			var strength = sets[setId].length;
			return STAR_RADIUS * (1 + strength * 0.05);
		});
	}

	function beginConnection(mousePos, world) {
		var highlightedId = Object.keys(world.highlighted)[0];
		if (world.star[highlightedId] && highlightedId) {
			var halfConnector = {
				id: 'curConnector',
				z: Layers.CONNECTORS,
				halfConnector: { begin: highlightedId, end: Point.clone(mousePos) },
				geometry: { type: 'line', width: CONNECTOR_WIDTH },
				color: Colors.CONNECTOR
			};
			return halfConnector;
		}
	}

	function closeConnection(highlightedStars, halfConnectors, neighbors, geometries) {
		var highlightedId = Object.keys(highlightedStars)[0];
		var halfConnectorId = Object.keys(halfConnectors)[0];
		if (halfConnectorId && highlightedId) {
			var halfConnector = halfConnectors[halfConnectorId];
			var highlightedGeom = geometries[highlightedId];

			var begin = halfConnector.begin;
			var end = highlightedId;
			if ((begin !== end) && !(neighbors[begin] && neighbors[begin][end]) ) {
				return { begin: begin, end: end };
			}
		}
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

	function newSets(connection, starSets) {
		var set1 = starSets[connection.begin];
		var set2 = starSets[connection.end];
		var newStarSets = {};

		if (set1 && set2) {
			var secondSet = Utils.filterObj(starSets, function(id, set) {
				return (set === set2);
			});
			newStarSets = Utils.mapObj(secondSet, function() { return set1; });
		} else {
			var newSet = set1 || set2 || connection.begin;
			newStarSets[connection.begin] = newSet;
			newStarSets[connection.end] = newSet;
		}

		return newStarSets;
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

	var END_GAME_TOP = 200;
	var END_GAME_OFF = 600;

	function getLoseText() {
		return Entity.first({
			id: 'LoseText',
			pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP},
			z: Layers.TEXT + 1,
			geometry: { type: 'text', text: 'YOU LOSE!', size: 3, align: 'center', border: 0 },
			color: Colors.LOSE_TEXT,
			target: {x: 400, y: END_GAME_TOP}
		}).bind(Entity.add({
			id: 'LoseText2',
			pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP + 70},
			z: Layers.TEXT + 1,
			geometry: { type: 'text', text: 'No triangles! Click to restart', size: 2, align: 'center', border: 0 },
			color: Colors.LOSE_TEXT,
			target: {x: 400, y: END_GAME_TOP + 70}
		})).bind(Entity.add({
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
		}));
	}

	function getWinText() {
		return Entity.first({
			id: 'WinText',
			pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP},
			z: Layers.TEXT + 1,
			geometry: { type: 'text', text: 'WELL DONE!', size: 3, align: 'center', border: 0 },
			color: Colors.LOSE_TEXT,
			target: {x: 400, y: END_GAME_TOP}
		}).bind(Entity.add({
			id: 'WinText2',
			pos: {x: 400, y: END_GAME_OFF + END_GAME_TOP + 70},
			z: Layers.TEXT + 1,
			geometry: { type: 'text', text: 'Click to continue', size: 2, align: 'center', border: 0 },
			color: Colors.LOSE_TEXT,
			target: {x: 400, y: END_GAME_TOP + 70}
		})).bind(Entity.add({
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
		}));
	}

	function createStars(initWorld, width, height, starCount, seed) {
		var prng = new Math.seedrandom(seed);

		var accumulator = Entity.start();
		for (var i = 0; i < starCount; i++) {
			var starPos = { 
				x: width * 0.2 + prng() * width * 0.6,
				y: height * 0.2 + prng() * height * 0.5,
			};
			var currentWorld = accumulator.execState(initWorld);

			if (Utils.someObj(currentWorld.pos, function(id, pos) {
				return (Point.dist(pos, starPos) < 3 * STAR_RADIUS);
			})) {
				i--;
				continue;
			}

			var star = Utils.mergeObjects(
				UIUtils.animatedStar('star' + i, starPos, Layers.STARS, STAR_RADIUS, STAR_BORDER, prng()),
				{
					highlightable: true,
					star: true
				}
			);
			accumulator = accumulator.bind(Entity.add(star));
		}

		return accumulator;
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

	function createDecorations(initWorld, width, height, seed) {
		return function() {
			var prng = new Math.seedrandom(seed);

			var accumulator = Entity.start();
			for (var i = 0; i < DECORATION_COUNT; i++) {
				var starPos = {
					x: prng() * width,
					y: prng() * height,
				};

				var off = prng() * 10;

				accumulator = accumulator.bind(Entity.add({
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
				}));
			}

			return accumulator;
		};
	}

	exports.frame = function(context, world, deltaTime, time) {
		var radii = Utils.mapObj(world.geometry, function(id, geometry) {
			return geometry.radius;
		});
		var newRadii = followTarget(deltaTime, world.targetRadius, radii);
		var newGeometries = Utils.mapObj(world.geometry, function(id, geometry) {
			return Utils.mergeObjects(geometry, {
				radius: newRadii[id]
			});
		});
		
		world = Utils.mergeObjects(world, {
			targetRadius: Utils.mergeObjects(world.targetRadius, determineStarStrength(world.starSet))
		}, {
			geometry: Utils.mergeObjects(world.geometry, newGeometries)
		});

		world = DefaultState.frame(context, world, deltaTime, time);

		var currentScore = Object.keys(world.connector).length;
		Geom.drawText(context, 'Level Score: ' + currentScore,
			Point.make(670, 510), 1.3, 'center', 0, Colors.Button.TEXT.primary);
		Geom.drawText(context, 'Possible Score: ' + world.possibleScore,
			Point.make(670, 535), 1.3, 'center', 0, Colors.Button.TEXT.primary);
		Geom.drawText(context, 'Total Score: ' + (world.score + currentScore),
			Point.make(670, 560), 1.3, 'center', 0, Colors.Button.TEXT.primary);

		return world;
	}

	exports.firstLevel = function(canvas, world) {
		return exports.init(canvas, world, 3, 0);
	};

	exports.init = function(canvas, world, starCount, score, seed) {
		var group1 = Math.floor(starCount * 0.5);
		var group2 = starCount - group1;
		var maxConnectionCount = group1 * group2;

		var world = {
			id: [],
			pos: {},
			geometry: {},
			color: {},
			velocity: {},
			draggable: {},
			dragOffset: {},
			target: {},
			targetRadius: {},
			highlightable: {},
			highlighted: {},
			connector: {},
			halfConnector: {},
			starSet: {},
			neighbor: {},
			z: {},
			button: {},
			animation: {},
			star: {},
			possibleScore: maxConnectionCount
		};


		world = createStars(world, canvas.width, canvas.height, starCount, seed)
		.bind(createDecorations(world, canvas.width, canvas.height, seed))
		.bind(Button.add('Restart', Point.make(120, 550), 
			Size.make(120, 90), 'Restart Level', function() {
				return function(canvas, world) {
					return exports.init(canvas, world, starCount, world.score);
				};
			}, seed))
		.bind(Button.add('NextLevel', Point.make(385, 550), 
			Size.make(120, 90), 'Next Level', function() {
				return function(canvas, world) {
					var score = world.score + Object.keys(world.connector).length;
					if (starCount === MAX_LEVEL) {
						return FinalState.init(canvas, world, score);
					} else {
						return exports.init(canvas, world, starCount + 1, score);
					}
				};
			}, seed))
		.bind(Entity.add(UIUtils.animatedCloud('Score', Point.make(670, 550), Size.make(140, 100), 0)))
		.execState(world);
		world = Utils.mergeObjects(world, { score: score });

		var onMouseDown = function(mousePos, world) {
			world = DefaultState.onMouseDown(mousePos, world);

			var halfConnector = beginConnection(mousePos, world);
			if (halfConnector) {
				world = Entity.first(halfConnector).execState(world);
			}
			return {
				world: world,
				newGame: false
			};
		};

		var onMouseUp = function(mousePos, world) {
			var res = DefaultState.onMouseUp(mousePos, world);
			world = res.world;
			buttonEvents = res.buttonEvents;
			var buttonEvent = Utils.firstObj(buttonEvents, function() { return true; });
			if (buttonEvent) {
				return {
					world: world,
					next: buttonEvent
				};
			}

			var halfConnectors = world.halfConnector;
			world = Utils.mergeObjects(world, {
				halfConnector: {}
			});

			var highlightedStars = Utils.filterObj(world.highlighted, function(id) {
				return world.star[id];
			});
			var connection = closeConnection(highlightedStars, halfConnectors, 
				world.neighbor, world.geometry);
			if (connection) {
				Sound.play('connect');
				world = Entity.first(createConnector(connection)).execState(world);

				var addNeighbors = newNeighbors(connection, world.neighbor);
				world = Utils.mergeObjects(world, {
					starSet: Utils.mergeObjects(world.starSet, newSets(connection, world.starSet)),
					neighbor: Utils.mergeObjects(world.neighbor, addNeighbors)
				});

				var common = commonNeighbor(world.neighbor[connection.begin], 
					world.neighbor[connection.end]);
				if (common) {
					Sound.play('lose');
					world = getLoseText().execState(world);

					return {
						world: Utils.mergeObjects(world, {
							highlighted: Utils.mergeObjects(world.highlighted, 
								getHighlightedTriangle(common, connection.begin, connection.end))
						}),
						next: function(canvas, world) {
							return EndGameState.init(canvas, world, starCount, world.score)
						}
					};
				}

				var group1 = Math.floor(starCount * 0.5);
				var group2 = starCount - group1;
				var maxConnectionCount = group1 * group2;
				var currentScore = Object.keys(world.connector).length;
				if (currentScore === maxConnectionCount) {
					Sound.play('win');
					world = getWinText().execState(world);
					return {
						world: world,
						next: function(canvas, world) {
							return EndGameState.init(canvas, world, starCount + 1,
								world.score + currentScore)
						}
					};
				}
			}

			return {
				world: world,
				gameOver: false
			};
		};

		var onMouseMove = function(mousePos, world) {
			world = DefaultState.onMouseMove(mousePos, world);
			return Utils.mergeObjects(world, {
				halfConnector: Utils.mapObj(world.halfConnector, function(id, halfConnector) {
					return {
						begin: halfConnector.begin,
						end: Point.clone(mousePos)
					};
				})
			});
		};

		return {
			world: world,
			onMouseDown: onMouseDown,
			onMouseUp: onMouseUp,
			onMouseMove: onMouseMove,
			frame: exports.frame
		};
	}
	
	return exports;
})(GameState || {});