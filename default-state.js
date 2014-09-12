var DefaultState = (function(exports) {
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

		return {
			component: [
				{
					pos: Movement.moveToTarget(deltaTime, world.target, world.pos)
				},
				animationRes
			],
			set: [],
			add: [],
			remove: []
		};
	};

	exports.draw = function(context, world) {
		Geom.draw(context, world.pos, world.geometry, world.color, world.highlighted,
			world.halfConnector, world.connector, world.z);
	};

	exports.onMouseDown = function(mousePos, world) {
		var highlighteds = UIUtils.getMouseOffsets(mousePos, world.pos,
			world.geometry, world.highlightable);
		var pressedButtons = Button.getPressed(highlighteds, world.button);
		return {
			component: [{
				button: pressedButtons,
				color: Button.getColors(pressedButtons, highlighteds),
			}],
			set: [{
				highlighted: highlighteds
			}],
			add: [],
			remove: []
		};
	};

	exports.onMouseUp = function(mousePos, world) {
		var releasedButtons = Button.getReleased(world.button);
		var reactingButtons = Utils.filterObj(releasedButtons, function(id, button) {
			return world.highlighted[id] && button.onClick;
		});

		return {
			component: [{
				button: releasedButtons,
				color: Button.getColors(releasedButtons, world.highlighted)
			}],
			events: Utils.values(Utils.mapObj(reactingButtons, function(id, button) {
				return button.onClick();
			})),
			set: [],
			add: [],
			remove: []
		};
	};

	exports.onMouseMove = function(mousePos, world) {
		var highlighteds = UIUtils.getMouseOffsets(mousePos, world.pos,
			world.geometry, world.highlightable);
		return {
			component: [{
				color: Button.getColors(world.button, highlighteds),
			}],
			set: [{
				highlighted: highlighteds
			}],
			add: [],
			remove: []
		};
	};

	return exports;
})(DefaultState || {});