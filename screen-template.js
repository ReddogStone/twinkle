var ScreenTemplate = (function(exports) {
	exports.make = function() {
		return {
			repeat: [
				{
					if: {
						first: MenuScreen,
						condition: function(termSignal) { return termSignal.help; },
						second: HelpScreen
					}
				},
				{
					repeatUntil: {
						termCondition: function(termSignal) { return !termSignal.level; },
						screen: {
							if: {
								first: GameScreen,
								condition: function(termSignal) { return !termSignal.instant; },
								second: EndGameScreen
							}
						}
					}
				},
				FinalScreen
			]
		};
	};

	return exports;
})(ScreenTemplate || {});