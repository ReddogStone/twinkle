var ButtonSystem = (function(exports) {
	exports = Object.create(ComponentSystem);

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
		return {
			updates: {
				button: pressedButtons,
				color: colors
			}
		}
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

		return {
			updates: {
				button: releasedButtons,
				color: Utils.mapObj(releasedButtons, function(id, button) {
					return hovered[id] ? 
						(button.pressed ? Colors.Button.PRESSED : Colors.Button.HOVERED) :
						Colors.Button.NORMAL;
				})
			},
			events: Object.keys(reactingButtons).map(function(id) {
				return {
					type: 'button_clicked',
					id: id,
					value: reactingButtons[id].onClick()
				};
			})
		};
	};

	exports.onMouseMove = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.geometry, world.button);
		return {
			updates: {
				color: Utils.mapObj(world.button, function(id, button) {
					return hovered[id] ? 
						(button.pressed ? Colors.Button.PRESSED : Colors.Button.HOVERED) :
						Colors.Button.NORMAL;
				})
			}
		}
	};

	return exports;
})(ButtonSystem || {});