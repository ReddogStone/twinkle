var AnimationSystem = (function(exports) {
	exports = Object.create(ComponentSystem);

	exports.update = function(world, deltaTime, time) {
		var animationRes = {};
		Utils.forEachObj(world.animation, function(id, animations) {
			for (var i = 0; i < animations.length; i++) {
				var animation = animations[i];
				var componentType = animation.type;
				var component = world[componentType][id];
				var changedComponent = animation.apply(time, component);
				animationRes[componentType] = animationRes[componentType] || {};
				animationRes[componentType][id] = changedComponent;
			}
		});

		return { updates: animationRes };
	};

	return exports;
})(AnimationSystem || {});