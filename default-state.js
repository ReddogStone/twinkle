var DefaultState = (function(exports) {
	exports.frame = function(context, world, deltaTime, time) {
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
		var animationUpdate = Utils.mapObj(animationRes, function(componentType, changes) {
			return Utils.mergeObjects(world[componentType], changes);
		});
		world = Utils.mergeObjects(world, {
			pos: Utils.mergeObjects(world.pos, Movement.moveToTarget(deltaTime, world.target, world.pos))
		}, animationUpdate);
		Geom.draw(context, world.pos, world.geometry, world.color, world.highlighted,
			world.halfConnector, world.connector, world.z);

		return world;
	};

	exports.onMouseDown = function(mousePos, world) {
		var highlighteds = UIUtils.getMouseOffsets(mousePos, world.pos,
			world.geometry, world.highlightable);
		var pressedButtons = Button.getPressed(highlighteds, world.button);
		world = Utils.mergeObjects(world, {
			button: Utils.mergeObjects(world.button, pressedButtons),
			color: Utils.mergeObjects(world.color,
				Button.getColors(pressedButtons, highlighteds)),
			highlighted: highlighteds
		});
		return world;
	};

	exports.onMouseUp = function(mousePos, world) {
		var releasedButtons = Button.getReleased(world.button);
		world = Utils.mergeObjects(world, {
			button: Utils.mergeObjects(world.button, releasedButtons),
			color: Utils.mergeObjects(world.color,
				Button.getColors(releasedButtons, world.highlighted))
		});
		var buttonEvents = Utils.mapObj(releasedButtons, function(id, button) {
			if (world.highlighted[id] && button.onClick) {
				return button.onClick();
			}
		});
		return {
			world: world,
			buttonEvents: buttonEvents
		};
	};

	exports.onMouseMove = function(mousePos, world) {
		var highlighteds = UIUtils.getMouseOffsets(mousePos, world.pos,
			world.geometry, world.highlightable);
		world = Utils.mergeObjects(world, {
			highlighted: highlighteds,
			color: Utils.mergeObjects(world.color, Button.getColors(world.button, highlighteds))
		});
		return world;
	};

	return exports;
})(DefaultState || {});