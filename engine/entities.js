var Entity = (function(exports) {

	function add(entitySystem, entity) {
		var update = Utils.mapObj(entity, function(componentType, value) {
			if (componentType !== 'id') {
				var components = entitySystem[componentType] || {};
				return Utils.setPropObj(components, entity.id, value);
			}
		});
		return Utils.mergeObjects(entitySystem, update);
	};

	var EntityAccumulatorProto = {
		add: function(entities) {
			if (!Array.isArray(entities)) {
				entities = Array.prototype.slice.call(arguments);
			}

			return makeAccumulator(entities.reduce(function(memo, entity) {
				return add(memo, entity);
			}, this._updates));
		},
		apply: function(entitySystem) {
			return Utils.mergeObjects(entitySystem, this._updates);
		}
	};

	exports.initSystem = function(componentNames) {
		if (!Array.isArray(componentNames)) {
			componentNames = Array.prototype.slice.call(arguments);
		}
		res = {
			id: []
		};
		for (var i = 0; i < componentNames.length; i++) {
			res[componentNames[i]] = {};
		}
		return res;
	};

	function makeAccumulator(componentUpdates) {
		var res = Object.create(EntityAccumulatorProto);
		res._updates = componentUpdates;
		return res;
	}

	exports.accumulator = function() {
		return makeAccumulator({
			id: []
		});
	};

	exports.add = function(world, entities) {
		if (!Array.isArray(entities)) {
			entities = Array.prototype.slice.call(arguments, 1);
		}

		return entities.reduce(function(memo, entity) {
			return add(memo, entity);
		}, world);
	};

	exports.remove = function(world, ids) {
		return ids.reduce(function(memo, id) {
			return Utils.mapObj(memo, function(componentType, system) {
				if ((typeof system !== 'object') || !(id in system)) {
					return system;
				}
				return Utils.filterObj(system, function(entityId) {
					return (entityId !== id);
				});
			});
		}, world);
	};

	return exports;
})(Entity || {});