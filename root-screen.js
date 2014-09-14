var RootScreen = (function(exports) {
	exports.init = function(canvas) {
		return GameScreen.firstLevel(canvas);
	};

	return exports;
})(RootScreen || {});