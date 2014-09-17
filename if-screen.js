var IfScreen = (function(exports) {
	function draw(state, context) {
		state.screen.draw(state.state, context);
	}

	exports.make = function(first, optional, test) {
		function makeReact(canvas, funcName) {
			return function(state) {
				var args = [state.state].concat(Array.prototype.slice.call(arguments, 1));

				var screen = state.screen;
				var res = screen[funcName].apply(screen, args);

				if (res) {
					if (res.term) {
						if (state.first) {
							var testRes = test(res.term);
							if (testRes) {
								var next = optional.init(canvas, screen, res.state, testRes);
								return {
									state: {
										screen: next.screen,
										state: next.state,
										first: false
									}
								};
							}
						}

						return {
							state: res.state,
							term: res.term
						};
					}
					return {
						state: Utils.setPropObj(state, 'state', res.state)
					};
				}

				return { state: state };
			};
		}

		return {
			init: function(canvas, prevScreen, prevState, prevTermSignal) {
				var current = first.init.apply(first, arguments);
				return {
					screen: {
						draw: draw,
						update: makeReact(canvas, 'update'),
						onMouseDown: makeReact(canvas, 'onMouseDown'),
						onMouseMove: makeReact(canvas, 'onMouseMove'),
						onMouseUp: makeReact(canvas, 'onMouseUp')
					},
					state: {
						screen: current.screen,
						state: current.state,
						first: true
					}
				};
			}
		};
	};

	return exports;
})(IfScreen || {});