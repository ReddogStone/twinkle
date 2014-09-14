var EndGameScreen = (function(exports) {

	exports.init = function(canvas, prevScreen, prevState, level) {
		return {
			screen: {
				draw: prevScreen.draw,
				update: prevScreen.update,
				onMouseDown: function(state, mousePos) {
					return Query.event({ '$term': level });
				},
				onMouseMove: function() {},
				onMouseUp: function() {}
			},
			state: prevState
		};		
	}

	return exports;
})(EndGameScreen || {});