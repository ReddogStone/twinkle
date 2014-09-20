var RepeatScreen = (function(exports) {
	function draw(state, context) {
		state.screen.draw(state.state, context);
	}

	function react(canvas, termCondition, state, func) {
		var screen = state.screen;
		var res = func(screen, state.state);

		if (res) {
			if (res.term) {
				if (termCondition && termCondition(res.term)) {
					return {
						state: res.state,
						term: res.term
					};
				}

				var next = state.screenTemplate.init(canvas, screen, res.state, res.term)
				return {
					state: {
						screen: next.screen,
						state: next.state,
						screenTemplate: state.screenTemplate
					}
				};
			}
			return {
				state: Utils.setPropObj(state, 'state', res.state)
			};
		}

		return { state: state };
	}

	function makeUpdate(canvas, termCondition) {
		return function(state, deltaTime, time) {
			return react(canvas, termCondition, state, function(screen, state) {
				return screen.update(state, deltaTime, time);
			});
		};
	}

	function makeMouseDown(canvas, termCondition) {
		return function(state, mousePos) {
			return react(canvas, termCondition, state, function(screen, state) {
				return screen.onMouseDown(state, mousePos);
			});
		};
	}

	function makeMouseMove(canvas, termCondition) {
		return function(state, mousePos) {
			return react(canvas, termCondition, state, function(screen, state) {
				return screen.onMouseMove(state, mousePos);
			});
		};
	}

	function makeMouseUp(canvas, termCondition) {
		return function(state, mousePos) {
			return react(canvas, termCondition, state, function(screen, state) {
				return screen.onMouseUp(state, mousePos);
			});
		};
	}

	exports.make = function(screen, termCondition) {
		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var current = screen.init.apply(screen, arguments);
				return {
					screen: {
						draw: draw,
						update: makeUpdate(canvas, termCondition),
						onMouseDown: makeMouseDown(canvas, termCondition),
						onMouseMove: makeMouseMove(canvas, termCondition),
						onMouseUp: makeMouseUp(canvas, termCondition)
					},
					state: {
						screen: current.screen,
						state: current.state,
						screenTemplate: screen
					}
				};
			}
		};
	};

	return exports;
})(RepeatScreen || {});