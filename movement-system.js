var MovementSystem = (function(exports) {
	exports = Object.create(ComponentSystem);

	exports.update = function(world, deltaTime, time) {
		return {
			updates: {
				pos: Movement.moveToTarget(deltaTime, world.target, world.pos)
			}
		};
	};

	return exports;
})(MovementSystem || {});