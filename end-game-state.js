var EndGameState = (function(exports) {

	exports.init = function(canvas, world, starCount, score, seed) {
		return {
			world: world,
			onMouseDown: function(event, world) {
				return {
					next: function() {
						return GameState.init(canvas, world, starCount, score, seed);
					}
				};
			},
			onMouseUp: function(event, world) { return { world: world }; },
			onMouseMove: function(event, world) { return world; },
			frame: GameState.frame
		};
	}

	return exports;
})(EndGameState || {});