var DefaultScreen = (function(exports) {
	function draw(state, context) {
		Geom.draw(context, state.pos, state.geometry, state.color, state.highlighted,
			state.halfConnector, state.connector, state.z);
	};

	function processComponentUpdates(state, updatesByType) {
		var changes = Utils.mapObj(updatesByType, function(componentType, updates) {
			return Utils.mergeObjects(state[componentType] || {}, Utils.mergeObjects(updates));
		});
		return Utils.mergeObjects(state, changes);
	}

	function processComponentRemoves(state, removesByType) {
		var changes = Utils.mapObj(removesByType, function(componentType, removes) {
			var idsToRemove = Utils.mergeObjects(removes);
			return Utils.filterObj(state[componentType] || {}, function(id) {
				return idsToRemove[id];
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
				removes[remove.componentType] = removes[remove.componentType] || [];
				removes[remove.componentType].push(remove.ids);
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

		var next = undefined;
		if (onEvent) {
			for (var i = 0; i < res.events.length; i++) {
				return {
					state: state,
					term: { starCount: 10, seed: 1337 }
				};

				var event = res.events[i];
				var eventRes = onEvent(state, event);
				if (eventRes.updates) {
					state = processComponentUpdates(state, eventRes.updates);
				}
				if (eventRes.add) {
					state = Entity.add(state, eventRes.add);
				}
				if (eventRes.remove) {
					state = Entity.remove(state, eventRes.remove);
				}
				if (eventRes.set) {
					state = Utils.mergeObjects(state, eventRes.set);
				}
				if (eventRes.next) {
					next = eventRes.next;
				}
			}
		}

		return {
			state: state
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
		return {
			draw: params.draw || draw,
			update: makeUpdate(systems, params.onEvent),
			onMouseDown: makeMouseDown(systems, params.onEvent),
			onMouseMove: makeMouseMove(systems, params.onEvent),
			onMouseUp: makeMouseUp(systems, params.onEvent)
		};
	};

	exports.draw = draw;

	return exports;
})(DefaultScreen || {});