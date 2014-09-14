var EndGameScreen = (function(exports) {

	exports.init = function(screen, score, level) {
		var clickToContinue = Object.create(ComponentSystem);
		clickToContinue.onMouseDown = function() {
			return { events: [{ type: 'continue' }] };
		};

		return {
			draw: screen.draw,
			world: screen.world,
			onEvent: function(world, event) {
				if (event.type === 'continue') {
					return {
						set: { score: score },
						next: function(screen) {
							if (level) {
								return GameScreen.init(screen.world, level)
							} else {
								return FinalScreen.init(screen.world.canvas, score);
							}
						}
					};
				}
			},
			systems: [clickToContinue, MovementSystem, AnimationSystem]
		};
	}

	return exports;
})(EndGameScreen || {});