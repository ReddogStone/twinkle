var IfScreen = (function(exports) {
	exports.make = function(first, optional, test) {
		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var wrapper = {
					react: function(screen, res, isFirstScreen) {
						if (res.term) {
							if (isFirstScreen) {
								if (test(res.term)) {
									var next = optional.init(canvas, screen, res.state, res.term);
									return WrapperScreen.makeRes(next, false);
								}
							}
							return res;
						}
					}
				};
				return WrapperScreen.init(wrapper, first.init.apply(first, arguments), true);
			}
		};
	};

	return exports;
})(IfScreen || {});