var Query = (function(exports) {
	exports.addEntity = function(entity) {
		var res = {};
		var insert = {};
		insert[id] = value;
		res[componentType] = {
			'$add': insert
		};
		return res;
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

	exports.event = function(event) {
		return {
			'$event': event
		};
	};

	return exports;
})(Query || {});