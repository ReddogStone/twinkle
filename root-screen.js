var RootScreen = (function(exports) {
	exports.init = function(canvas) {
		var inLevel = IfScreen.make(GameScreen, EndGameScreen, function(termSignal) {
			if (!termSignal.instant) {
				return termSignal;
			}
		});

		return RepeatScreen.make(inLevel)
		.init(canvas, undefined, undefined, { score: 0, level: {starCount: 3, seed: 10} });
	};

	return exports;
})(RootScreen || {});