var RepeatScreen = (function(exports) {
	exports.make = function(screenTemplate, termCondition) {
		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var wrapper = {
					react: function(screen, res) {
						if (res.term) {
							if (termCondition && termCondition(res.term)) {
								return res;
							}
							var next = screenTemplate.init(canvas, screen, res.state, res.term);
							return WrapperScreen.makeRes(next);
						}
					}
				};
				var current = screenTemplate.init.apply(screenTemplate, arguments);
				return WrapperScreen.init(wrapper, current);
			}
		};
	};

	return exports;
})(RepeatScreen || {});