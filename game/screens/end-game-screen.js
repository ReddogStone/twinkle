var EndGameScreen = (function(exports) {

	exports.init = function(canvas, prevScreen, prevState, scoreAndLevel) {
		return {
			screen: {
				draw: prevScreen.draw,
				update: prevScreen.update,
				onMouseDown: function(state, mousePos) {
					return { state: state, term: scoreAndLevel };
				},
				onMouseMove: function() {},
				onMouseUp: function() {}
			},
			state: prevState
		};		
	}

	return exports;
})(EndGameScreen || {});