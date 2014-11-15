var Query = (function(exports) {
	exports.addEntity = function(entity) {
		return { '$addEntity': entity };
	};

	exports.removeEntity = function(id) {
		return { '$removeEntity': id };
	};

	exports.upsertComponent = function(componentType, id, value) {
		var values = {};
		values[id] = value;
		return exports.upsertComponents(componentType, values);
	};

	exports.upsertComponents = function(componentType, valuesById) {
		return {
			'$upsertComponents': {
				componentType: componentType,
				values: valuesById
			}
		};
	};

	exports.removeComponents = function(componentType, ids) {
		var removeIds = {};
		for (var i = 0; i < ids.length; i++) {
			removeIds[ids[i]] = true;
		}
		return {
			'$removeComponents': {
				componentType: componentType,
				ids: removeIds
			}
		};
	};

	exports.set = function(key, value) {
		var setObject = {};
		setObject[key] = value;
		return {
			'$set': setObject
		};
	};

	exports.event = function(type, value) {
		return {
			'$event': {
				type: type,
				value: value
			}
		};
	};

	return exports;
})(Query || {});