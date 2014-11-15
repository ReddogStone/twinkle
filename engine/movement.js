var Movement = (function(exports) {

	exports.movePos = function(deltaTime, velocities, positions) {
		return Utils.mapObj(velocities, function(id, velocity) {
			var pos = positions[id];
			return Point.make(pos.x + velocity.x * deltaTime, pos.y + velocity.y * deltaTime);
		});
	};

	exports.dragPos = function(mousePos, dragOffsets) {
		return Utils.mapObj(dragOffsets, function(id, offset) {
			return Point.make(mousePos.x + offset.x, mousePos.y + offset.y);
		});
	};

	exports.moveToTarget = function(deltaTime, targets, positions) {
		return Utils.mapObj(targets, function(id, target) {
			var pos = positions[id];
			var alpha = Math.pow(0.5, 5 * deltaTime);
			return Point.make(alpha * pos.x + (1 - alpha) * target.x, 
				alpha * pos.y + (1 - alpha) * target.y);
		});
	};

	return exports;
})(Movement || {});