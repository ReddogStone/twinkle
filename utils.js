var Utils = (function(exports) {
	
	exports.forEachObj = function(obj, func, thisArg) {
		if (!obj) {
			throw new Error('No obj');
		}
		var keys = Object.keys(obj);
		var l = keys.length;
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			func.call(thisArg, key, obj[key], obj);
		}
	};

	exports.mapObj = function(obj, func, thisArg) {
		if (!obj) {
			throw new Error('No obj');
		}
		var keys = Object.keys(obj);
		var l = keys.length;
		var res = {};
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			res[key] = func.call(thisArg, key, obj[key], obj);
		}
		return res;
	};

	exports.filterObj = function(obj, func, thisArg) {
		var keys = Object.keys(obj);
		var l = keys.length;
		var res = {};
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			if (func.call(thisArg, key, obj[key], obj)) {
				res[key] = obj[key];
			}
		}
		return res;
	};

	exports.firstObj = function(obj, func, thisArg) {
		var keys = Object.keys(obj);
		var l = keys.length;
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			if (func.call(thisArg, key, obj[key], obj)) {
				return obj[key];
			}
		}
		return undefined;
	};

	exports.firstKeyObj = function(obj, func, thisArg) {
		var keys = Object.keys(obj);
		var l = keys.length;
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			if (func.call(thisArg, key, obj[key], obj)) {
				return key;
			}
		}
		return undefined;
	};

	exports.everyObj = function(obj, func, thisArg) {
		var keys = Object.keys(obj);
		var l = keys.length;
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			if (!func.call(thisArg, key, obj[key], obj)) {
				return false;
			}
		}
		return true;
	};

	exports.someObj = function(obj, func, thisArg) {
		var keys = Object.keys(obj);
		var l = keys.length;
		for (var i = 0; i < l; i++) {
			var key = keys[i];
			if (func.call(thisArg, key, obj[key], obj)) {
				return true;
			}
		}
		return false;
	};

	exports.mergeObjects = function(objects) {
		if (!Array.isArray(objects)) {
			objects = Array.prototype.slice.call(arguments);
		}
		return objects.reduceRight(function(memo, current) {
			exports.forEachObj(current, function(key, value) {
				if (memo[key] === undefined) {
					memo[key] = value;
				}
			});
			return memo;
		}, {});
	};

	exports.transposeObj = function(obj) {
		var res = {};
		exports.forEachObj(obj, function(key, value) {
			res[value] = res[value] || [];
			res[value].push(key);
		});
		return res;
	};

	return exports;
})(Utils || {});