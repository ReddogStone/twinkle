var SwitchScreen = (function(exports) {
	exports.make = function(screens, decide) {
		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var decission = decide(prevTermSignal);
				var screenTemplate = screens[decission.index];
				var res = screenTemplate.init.apply(screenTemplate, arguments);
				return {
					screen: {
						draw: res.screen.draw,
						update: res.screen.update,
						onMouseDown: res.screen.onMouseDown,
						onMouseMove: res.screen.onMouseMove,
						onMouseUp: res.screen.onMouseUp
					},
					state: res.state
				};
			}
		};
	};

	return exports;
})(SwitchScreen || {});v