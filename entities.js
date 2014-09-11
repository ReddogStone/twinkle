var Entity = (function(exports) {

	exports.start = function() {
		return StateMonad.ret();
	};

	exports.first = function(entity) {
		return StateMonad.make(function(world) {
			var newComponents = Utils.mapObj(entity, function(key, value) {
				if (key === 'id') {
					return world.id.concat([value]);
				} else {
					var newComponent = {};
					newComponent[entity.id] = value;
					return Utils.mergeObjects(world[key], newComponent);
				}
			});
			return {
				value: undefined,
				state: Utils.mergeObjects(world, newComponents)
			};
		});
	};

	exports.add = function(entity) {
		return function() {
			return exports.first(entity);
		};
	};

	return exports;
})(Entity || {});