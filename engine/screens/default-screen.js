var DefaultScreen = (function(exports) {
	function draw(state, graphics, time, deltaTime) {
		var objects = Utils.mapObj(state.material, function(id, material) {
			var geom = state.geometry[id];
			var color = material.color;
			var highlighted = state.highlighted[id];
			var renderScript = graphics.assets.renderScripts[material.renderScript.id];
			var renderFunc = renderScript ? renderScript[material.renderScript.mode] : null;

			var pos = state.pos[id];
			var size = state.size[id];
			var transform = {x: pos.x, y: pos.y};
			if (size) {
				transform.sx = size.x;
				transform.sy = size.y;
			}

			var params = {
				color: {
					primary: color.primary,
					secondary: highlighted ? color.highlighted : color.secondary
				}
			};
			var button = state.button[id];
			if (button) {
				params.color = highlighted ? (button.pressed ? color.pressed : color.hovered) : color.normal;
			}

			return {
				geometry: {
					transform: transform,
					data: geom
				},
				params: params,
				render: renderFunc
			};
		});

		Geom.draw(graphics.context, state.pos, state.geometry, state.color, state.highlighted, state.z);

		var ids = Object.keys(objects).sort(function(id1, id2) {
			return state.z[id1] - state.z[id2];
		});

		for (var i = 0; i < ids.length; i++) {
			var obj = objects[ids[i]];
			if (obj.render) {
				obj.render(graphics, time, deltaTime, [obj.geometry], obj.params);
			}
		}
	};

	function processComponentUpdates(state, updatesByType) {
		var changes = Utils.mapObj(updatesByType, function(componentType, updates) {
			return Utils.mergeObjects(state[componentType] || {}, Utils.mergeObjects(updates));
		});
		return Utils.mergeObjects(state, changes);
	}

	function processComponentRemoves(state, removesByType) {
		var changes = Utils.mapObj(removesByType, function(componentType, idsToRemove) {
			return Utils.filterObj(state[componentType] || {}, function(id) {
				return !idsToRemove[id];
			});
		});
		return Utils.mergeObjects(state, changes);		
	}

	function processQueries(state, queries) {
		var events = [];
		var sets = [];
		var upserts = {};
		var removes = {};
		for (var i = 0; i < queries.length; i++) {
			var query = queries[i];
			if (query['$event']) {
				events.push(query['$event']);
			} else if (query['$set']) {
				sets.push(query['$set']);
			} else if (query['$upsertComponents']) {
				var upsert = query['$upsertComponents'];
				upserts[upsert.componentType] = upserts[upsert.componentType] || [];
				upserts[upsert.componentType].push(upsert.values);
			} else if (query['$removeComponents']) {
				var remove = query['$removeComponents'];
				removes[remove.componentType] = removes[remove.componentType] || {};
				for (var j = 0; j < remove.ids.length; j++) {
					removes[remove.componentType][remove.ids[j]] = true;
				}
			} else if (query['$addEntity']) {
				var entity = query['$addEntity'];
				Utils.forEachObj(entity, function(componentType, component) {
					if (componentType !== 'id') {
						var addComponent = {};
						addComponent[entity.id] = component;
						upserts[componentType] = upserts[componentType] || [];
						upserts[componentType].push(addComponent);
					}
				});
			} else if (query['$removeEntity']) {
				var idToRemove = query['$removeEntity'];
				var containingSystems = Utils.filterObj(state, function(componentType, system) {
					return (typeof system === 'object') && (idToRemove in system);
				});
				Utils.forEachObj(containingSystems, function(componentType) {
					removes[componentType] = removes[componentType] || {};
					removes[componentType][idToRemove] = true;
				});
			}
		}

		state = Utils.mergeObjects(state, Utils.mergeObjects(sets));
		state = processComponentUpdates(state, upserts);
		state = processComponentRemoves(state, removes);

		return {
			state: state,
			events: events
		};
	}

	function processUpdates(systems, state, func, onEvent) {
		var queries = systems.reduce(function(memo, system) {
			var queries = func(system) || [];
			if (!Array.isArray(queries)) {
				queries = [queries];
			}
			return memo.concat(queries);
		}, []);
		var res = processQueries(state, queries);
		var state = res.state;
		var events = res.events;

		var term = undefined;
		var eventQueries = [];
		if (onEvent) {
			for (var i = 0; i < res.events.length; i++) {
				var event = res.events[i];

				switch (event.type) {
					case 'term':
						term = event.value || {};
						break;
					default:
						var newQueries = onEvent(state, event) || [];
						if (!Array.isArray(newQueries)) {
							newQueries = [newQueries];
						}
						eventQueries = eventQueries.concat(newQueries);
						break;
				}
			}
		}

		res = processQueries(state, eventQueries);
		state = res.state;

		for (var i = 0; i < res.events.length; i++) {
			var event = res.events[i];
			if (event.type === 'term') {
				term = event.value;
			} else {
				throw new Error('Unexpected event: ' + JSON.stringify(event));
			}
		}

		return {
			state: state,
			term: term
		};
	}

	function makeUpdate(systems, onEvent) {
		return function(state, deltaTime, time) {
			return processUpdates(systems, state, function(system) {
				return system.update ? system.update(state, deltaTime, time) : {};
			}, onEvent);
		};
	}

	function makeMouseDown(systems, onEvent) {
		return function(state, mousePos) {
			return processUpdates(systems, state, function(system) {
				return system.onMouseDown ? system.onMouseDown(state, mousePos) : {};
			}, onEvent);
		};
	}

	function makeMouseMove(systems, onEvent) {
		return function(state, mousePos) {
			return processUpdates(systems, state, function(system) {
				return system.onMouseMove ? system.onMouseMove(state, mousePos) : {};
			}, onEvent);
		};
	}

	function makeMouseUp(systems, onEvent) {
		return function(state, mousePos) {
			return processUpdates(systems, state, function(system) {
				return system.onMouseUp ? system.onMouseUp(state, mousePos) : {};
			}, onEvent);
		};
	}

	exports.make = function(systems, params) {
		params = params || {};
		var onEvent = params.onEvent || function(state, event) {
			console.log('Unhandled event: ' + JSON.stringify(event));
			return [];
		};
		return {
			draw: params.draw || draw,
			update: makeUpdate(systems, onEvent),
			onMouseDown: makeMouseDown(systems, onEvent),
			onMouseMove: makeMouseMove(systems, onEvent),
			onMouseUp: makeMouseUp(systems, onEvent)
		};
	};

	exports.draw = draw;

	return exports;
})(DefaultScreen || {});