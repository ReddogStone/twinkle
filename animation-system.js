var AnimationSystem = (function(exports) {
	exports.update = function(world, deltaTime, time) {
		var animationRes = {};
		var queries = [];
		Utils.forEachObj(world.animation, function(id, animations) {
			for (var i = 0; i < animations.length; i++) {
				var animation = animations[i];
				var componentType = animation.type;
				var component = world[componentType][id];
				var changedComponent = animation.apply(time, component);
				queries.push(Query.upsertComponent(componentType, id, changedComponent));
			}
		});
		return queries;
	};

	return exports;
})(AnimationSystem || {});