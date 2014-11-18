var ScriptLoader = (function() {
	var head = document.getElementsByTagName('head')[0] || document.documentElement;
	function loadScript(url, callback) {
		var prevErrorHandler = window.onerror;

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'utf-8';
		script.async = true;

		script.onload = function() {
			head.removeChild(script);
			window.onerror = prevErrorHandler;

			callback(null);
		};

		script.onerror = function() {
			callback(new Error('Could not load: ' + url));
		};
/*		window.onerror = function() {
			callback(new Error('Syntax error: ' + JSON.stringify(arguments)));
			return true;
		}; */

		head.appendChild(script);
		script.src = url;
	}

	function clone(obj) {
		var res = {};
		Object.keys(obj).forEach(function(key) {
			res[key] = obj[key];
		});
		return res;
	}

	var scriptQueue = {};

	return {
		module: function(init) {
			var id = document.currentScript.getAttribute('src', -1);

			try {
				scriptQueue[id] = init();
//				console.log('Loaded module from "' + id + '"');
			} catch (e) {
				return callback(e);
			}			
		},
		load: function(url, cache, callback) {
			var resultCache = clone(cache);
			loadScript(url, function(err) {
				if (err) {
					return callback(err);
				}

				resultCache[url] = scriptQueue[url];
				delete scriptQueue[url];

//				console.log('Loaded "' + url + '"');

				callback(null, resultCache[url], resultCache);
			});
		}
	};
})();