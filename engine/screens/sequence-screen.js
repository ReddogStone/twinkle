var SequenceScreen = (function(exports) {
	exports.make = function(screens) {
		if (!Array.isArray(screens)) {
			screens = Array.prototype.slice.call(arguments);
		}
		if (screens.length === 0) {
			throw new Error('Sequence needs atleast one screen!');
		}
		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var wrapper = {
					react: function(screen, res, nextScreens) {
						if (res.term) {
							if (nextScreens.length > 0) {
								var next = nextScreens[0].init(canvas, screen, res.state, res.term)
								return WrapperScreen.makeRes(next, nextScreens.slice(1));
							}

							return res;
						}
					}
				};
				var current = screens[0].init.apply(screens[0], arguments);
				return WrapperScreen.init(wrapper, current, screens.slice(1));
			}
		};
	};

	return exports;
})(SequenceScreen || {});