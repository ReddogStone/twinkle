var MovementSystem = (function(exports) {
	exports.update = function(world, deltaTime, time) {
		return Query.upsertComponents('pos', Movement.moveToTarget(deltaTime, world.target, world.pos));
	};

	return exports;
})(MovementSystem || {});
