var RootScreen = (function(exports) {
	exports.init = function(canvas) {
		return SequenceScreen.make(GameScreen, EndGameScreen).init(canvas, undefined, {score: 0}, 
			{starCount: 3, seed: 10});
	};

	return exports;
})(RootScreen || {});