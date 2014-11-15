var ButtonSystem = (function(exports) {
	exports.onMouseDown = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.geometry, world.button);
		var pressedButtons = Utils.mapObj(hovered, function(id) {
			return Utils.mergeObjects(world.button[id], {pressed: true});
		});
		var colors = Utils.mergeObjects(
			Utils.mapObj(world.button, function() {
				return Colors.Button.NORMAL;
			}),
			Utils.mapObj(pressedButtons, function(id) {
				return hovered[id] ? Colors.Button.PRESSED : Colors.Button.NORMAL;
			})
		);

		return [
			Query.upsertComponents('button', pressedButtons),
			Query.upsertComponents('color', colors)
		];
	};

	exports.onMouseUp = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.geometry, world.button);
		var pressedButtons = Utils.filterObj(world.button, function(id, button) {
			return button.pressed;
		});
		var releasedButtons = Utils.mapObj(pressedButtons, function(id, button) {
			return Utils.mergeObjects(button, {pressed: false});
		});
		var reactingButtons = Utils.filterObj(releasedButtons, function(id, button) {
			return hovered[id] && button.onClick;
		});
		var colors = Utils.mapObj(releasedButtons, function(id, button) {
			return hovered[id] ? Colors.Button.HOVERED : Colors.Button.NORMAL;
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
			Query.upsertComponents('color', colors),
		].concat(buttonQueries);
	};

	exports.onMouseMove = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.geometry, world.button);
		var colors = Utils.mapObj(world.button, function(id, button) {
			return hovered[id] ? 
				(button.pressed ? Colors.Button.PRESSED : Colors.Button.HOVERED) :
				Colors.Button.NORMAL;
		});
		return Query.upsertComponents('color', colors);
	};

	return exports;
})(ButtonSystem || {});