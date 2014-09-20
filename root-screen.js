var RootScreen = (function(exports) {
	exports.init = function(canvas) {
		var inLevel = IfScreen.make(GameScreen, EndGameScreen, function(termSignal) {
			if (!termSignal.instant) {
				return termSignal;
			}
		});
		var menu = IfScreen.make(MenuScreen, HelpScreen, function(termSignal) {
			if (termSignal.help) {
				return termSignal;
			}
		});

		return RepeatScreen.make(
			SequenceScreen.make(
				menu,
				RepeatScreen.make(inLevel, function(termSignal) { return !termSignal.level; }),
				FinalScreen
			)
		).init(canvas);
	};

	return exports;
})(RootScreen || {});