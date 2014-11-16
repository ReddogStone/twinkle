var ButtonSystem = (function(exports) {
	exports.onMouseDown = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.size, world.geometry, world.button);
		var pressedButtons = Utils.mapObj(hovered, function(id) {
			return Utils.mergeObjects(world.button[id], {pressed: true});
		});

		return Query.upsertComponents('button', pressedButtons);
	};

	exports.onMouseUp = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.size, world.geometry, world.button);
		var pressedButtons = Utils.filterObj(world.button, function(id, button) {
			return button.pressed;
		});
		var releasedButtons = Utils.mapObj(pressedButtons, function(id, button) {
			return Utils.mergeObjects(button, {pressed: false});
		});
		var reactingButtons = Utils.filterObj(releasedButtons, function(id, button) {
			return hovered[id] && button.onClick;
		});

		var buttonQueries = Object.keys(reactingButtons).reduce(function(memo, id) {
			var queries = reactingButtons[id].onClick(world);
			if (!Array.isArray(queries)) {
				queries = [queries];
			}
			return memo.concat(queries);
		}, []);

		return [
			Query.upsertComponents('button', releasedButtons),
		].concat(buttonQueries);
	};

	return exports;
})(ButtonSystem || {});