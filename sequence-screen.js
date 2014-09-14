var SequenceScreen = (function(exports) {
	function draw(state, context) {
		state.currentScreen.draw(state.currentState, context);
	}

	function react(canvas, state, func) {
		var currentScreen = state.currentScreen;
		var res = func(currentScreen, state.currentState);

		if (res) {
			if (res.term) {
				var nextScreens = state.nextScreens;
				if (nextScreens.length > 0) {
					var next = nextScreens[0].init(canvas, currentScreen, res.state, res.term)
					return {
						state: {
							currentScreen: next.screen,
							currentState: next.state,
							nextScreens: nextScreens.slice(1)
						}
					};
				}

				return {
					state: res.state,
					term: res.term
				};
			}
			return {
				state: Utils.setPropObj(state, 'currentState', res.state)
			};
		}

		return { state: state };
	}

	function makeUpdate(canvas) {
		return function(state, deltaTime, time) {
			return react(canvas, state, function(screen, state) {
				return screen.update(state, deltaTime, time);
			});
		};
	}

	function makeMouseDown(canvas) {
		return function(state, mousePos) {
			return react(canvas, state, function(screen, state) {
				return screen.onMouseDown(state, mousePos);
			});
		};
	}

	function makeMouseMove(canvas) {
		return function(state, mousePos) {
			return react(canvas, state, function(screen, state) {
				return screen.onMouseMove(state, mousePos);
			});
		};
	}

	function makeMouseUp(canvas) {
		return function(state, mousePos) {
			return react(canvas, state, function(screen, state) {
				return screen.onMouseUp(state, mousePos);
			});
		};
	}

	exports.make = function(screens) {
		if (!Array.isArray(screens)) {
			screens = Array.prototype.slice.call(arguments);
		}
		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var current = screens[0].init(canvas, prevScreen, prevState, prevTermSignal);
				return {
					screen: {
						draw: draw,
						update: makeUpdate(canvas),
						onMouseDown: makeMouseDown(canvas),
						onMouseMove: makeMouseMove(canvas),
						onMouseUp: makeMouseUp(canvas)
					},
					state: {
						currentScreen: current.screen,
						currentState: current.state,
						nextScreens: screens.slice(1)
					}
				};
			}
		};
	};

	return exports;
})(SequenceScreen || {});