var WrapperScreen = (function(exports) {
	function makeState(wrapped, wrapperState) {
		return {
			screen: wrapped.screen,
			state: wrapped.state,
			wrapperState: wrapperState
		};
	};

	function draw(state, context) {
		state.screen.draw(state.state, context);
	}

	function makeReact(funcName, wrapper) {
		return function react(state) {
			var wrappedScreen = state.screen;
			var wrappedState = state.state;
			var params = [wrappedState].concat(Array.prototype.slice.call(arguments, 1));
			var res = wrappedScreen[funcName].apply(wrappedScreen, params);
			if (res) {
				var wrapperRes = wrapper(wrappedScreen, res, state.wrapperState);
				return wrapperRes || {
					state: Utils.setPropObj(state, 'state', res.state)
				};
			}
			return { state: state };
		};
	}

	exports.init = function(wrapper, wrapped, wrapperState) {
		var wrapperDraw = wrapper.draw || draw;
		var wrapperUpdate = wrapper.react.update;
		var wrapperMouseDown = wrapper.react.onMouseDown;
		var wrapperMouseMove = wrapper.react.onMouseMove;
		var wrapperMouseUp = wrapper.react.onMouseUp;
		if ((typeof wrapper.react) === 'function') {
			wrapperUpdate = wrapperMouseDown = wrapperMouseMove = wrapperMouseUp = wrapper.react;
		}

		return {
			screen: {
				draw: wrapperDraw,
				update: makeReact('update', wrapperUpdate),
				onMouseDown: makeReact('onMouseDown', wrapperMouseDown),
				onMouseMove: makeReact('onMouseMove', wrapperMouseMove),
				onMouseUp: makeReact('onMouseUp', wrapperMouseUp)
			},
			state: makeState(wrapped, wrapperState)
		};
	};

	exports.makeRes = function(wrapped, wrapperState) {
		return Screen.state(makeState(wrapped, wrapperState));
	};

	return exports;
})(WrapperScreen || {});