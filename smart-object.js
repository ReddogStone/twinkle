var SmartObject = (function(exports) {

	var SmartObjectProto = {
		_empty: function() {
			return Object.create(Object.getPrototypeOf(this));
		},
		forEach: function(func, thisArg) {
			Utils.forEachObj(this, func, thisArg);
		},
		map: function(func, thisArg) {
			var keys = Object.keys(this);
			var l = keys.length;
			var res = this._empty();
			for (var i = 0; i < l; i++) {
				var key = keys[i];
				res[key] = func.call(thisArg, key, this[key], this);
			}
			return res;
		},
		filter: function(func, thisArg) {
			var keys = Object.keys(this);
			var l = keys.length;
			var res = this._empty();
			for (var i = 0; i < l; i++) {
				var key = keys[i];
				if (func.call(thisArg, key, this[key], this)) {
					res[key] = this[key];
				}
			}
			return res;
		},
		first: function(func, thisArg) {
			return Utils.firstObj(this, func, thisArg);
		},
		firstKey: function(func, thisArg) {
			return Utils.firstKeyObj(this, func, thisArg);
		},
		every: function(func, thisArg) {
			return Utils.everyObj(this, func, thisArg);
		},
		some: function(func, thisArg) {
			return Utils.someObj(this, func, thisArg);
		},
		merge: function(objects) {
			if (!Array.isArray(objects)) {
				objects = Array.prototype.slice.call(arguments);
			}
			objects = [this].concat(objects);
			return objects.reduceRight(function(memo, current) {
				Utils.forEachObj(current, function(key, value) {
					if (memo[key] === undefined) {
						memo[key] = value;
					}
				});
				return memo;
			}, this._empty());
		},
		set: function(key, value) {
			var res = this.map(function(_, v) { return v; });
			res[key] = value;
			return res;
		},
		transpose: function() {
			var res = this._empty();
			this.forEach(function(key, value) {
				res[value] = res[value] || [];
				res[value].push(key);
			});
			return res;
		}
	};

	function empty() {
		return Object.create(SmartObjectProto);
	}

	exports.fromObj = function(obj) {
		var res = empty();
		Utils.forEachObj(obj, function(key, value) {
			res[key] = value;
		});
		return res;
	};

	exports.fromKeysValues = function(keys, values) {
		var res = empty();
		for (var i = 0; i < keys.length; i++) {
			res[keys[i]] = values[i];
		}
		return res;
	};

	exports.empty = empty;

	return exports;
})(SmartObject || {});