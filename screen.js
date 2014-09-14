var Screen = (function(exports) {
	function processWorldUpdates(world, updates) {
		var updateComponents = updates.component ? Utils.mergeObjects(updates.component) : {};
		var addEntities = updates.add || [];
		var removeEntities = updates.remove || [];
		var setProperties = updates.set ? Utils.mergeObjects(updates.set) : {};

		var changes = Utils.mapObj(updateComponents, function(componentType, update) {
			return Utils.mergeObjects(world[componentType], update);
		});
		changes = Utils.mergeObjects(changes, setProperties);

		// TODO: remove entities

		return Entity.add(Utils.mergeObjects(world, changes), addEntities);
	}

	function processComponentUpdates(world, updates) {
		var changes = Utils.mapObj(updates, function(componentType, update) {
			return Utils.mergeObjects(world[componentType] || {}, update);
		});
		return Utils.mergeObjects(world, changes);
	}

	function processUpdates(screen, func) {
		var res = screen.systems.reduce(function(memo, system) {
			var res = func(system);
			if (!res) {
				throw new Error('No update result');
			}
			return {
				updates: processComponentUpdates(memo.updates, res.updates || {}),
				events: memo.events.concat(res.events || [])
			};
		}, { updates: {}, events: [] });
		var world = processComponentUpdates(screen.world, res.updates);

		var next = undefined;
		if (res.events && screen.onEvent) {
			for (var i = 0; i < res.events.length; i++) {
				var event = res.events[i];
				var eventRes = screen.onEvent(world, event);
				if (eventRes.updates) {
					world = processComponentUpdates(world, eventRes.updates);
				}
				if (eventRes.add) {
					world = Entity.add(world, eventRes.add);
				}
				if (eventRes.remove) {
					world = Entity.remove(world, eventRes.remove);
				}
				if (eventRes.set) {
					world = Utils.mergeObjects(world, eventRes.set);
				}
				if (eventRes.next) {
					next = eventRes.next;
				}
			}
		}

		var newScreen = Utils.setPropObj(screen, 'world', world);
		return next ? next(newScreen) : newScreen;
	}

	exports.update = function(screen, deltaTime, time) {
		return processUpdates(screen, function(system) {
			return system.update(screen.world, deltaTime, time);
		});
	};

	exports.draw = function(screen, context) {
		screen.draw(context, screen.world);
	};

	exports.onMouseDown = function(screen, mousePos) {
		return processUpdates(screen, function(system) {
			return system.onMouseDown(screen.world, mousePos);
		});
	};

	exports.onMouseMove = function(screen, mousePos) {
		return processUpdates(screen, function(system) {
			return system.onMouseMove(screen.world, mousePos);
		});
	};

	exports.onMouseUp = function(screen, mousePos) {
		return processUpdates(screen, function(system) {
			return system.onMouseUp(screen.world, mousePos);
		});
	};

	return exports;
})(Screen || {});