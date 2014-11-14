var ScriptLoader = (function() {
	var head = document.getElementsByTagName('head')[0] || document.documentElement;
	function loadScript(url, callback) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'utf-8';
		script.async = false;

		script.addEventListener('load', function() {
			head.removeChild(script);
			callback(null);
		}, false);

		script.addEventListener('error', function(err) {
			callback(err);
		}, false);

		script.src = url;
		head.appendChild(script);
	}

	function makeModuleFunc(id, cache) {
		return function(init) {
			cache[id] = init();
			console.log('Loaded module from "' + id + '"');
		};
	}

	function clone(obj) {
		var res = {};
		Object.keys(obj).forEach(function(key) {
			res[key] = obj[key];
		});
		return res;
	}

	var me = {
		load: function(url, cache, callback) {
			var resultCache = clone(cache);
			me.module = makeModuleFunc(url, resultCache);
			loadScript(url, function(err) {
				if (err) {
					return callback(err);
				}

				console.log('Loaded "' + url + '"');

				delete me.module;
				callback(null, resultCache[url], resultCache);
			});
		}
	};
	return me;
})();