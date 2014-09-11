var Button = (function(exports) {
	var Color = {
		NORMAL: { primary: 'lightskyblue', secondary: '#6F7190' },
		HOVERED: { primary: 'lightskyblue', secondary: 'indianred' },
		PRESSED: { primary: 'cadetblue', secondary: 'brown' },
	};

	exports.getPressed = function(highlighted, buttons) {
		var hoveredButtons = Utils.filterObj(highlighted, function(id) {
			return !!buttons[id];
		});
		return Utils.mapObj(hoveredButtons, function(id) {
			return Utils.mergeObjects(buttons[id], {pressed: true});
		});
	}
	exports.getReleased = function(buttons) {
		var pressedButtons = Utils.filterObj(buttons, function(id, button) {
			return button.pressed;
		});
		return Utils.mapObj(pressedButtons, function(id, button) {
			return Utils.mergeObjects(button, {pressed: false});
		});
	}

	exports.getColors = function(buttons, hovered) {
		return Utils.mapObj(buttons, function(id, button) {
			return hovered[id] ? 
				(button.pressed ? Colors.Button.PRESSED : Colors.Button.HOVERED) :
				Colors.Button.NORMAL;
		});
	}

	exports.make = function(id, pos, size, text, onClick, seed) {
	};

	exports.add = function(id, pos, size, text, onClick, seed) {
		var cloudParts = 8;
		var cloudCircles = Geom.createCloud(cloudParts, seed || Math.random());
		var radiusAnimationParams = [];
		for (var i = 0; i < cloudParts; i++) {
			radiusAnimationParams.push({
				amplitude: Math.random() * 0.05 + 0.05,
				frequency: Math.random() * 1 + 3,
				offset: Math.random() * 10
			});
		}

		return function() {
			return Entity.first(Utils.mergeObjects(
				UIUtils.animatedCloud(id, pos, size, 10, seed), 
				{ button: {pressed: false, onClick: onClick} }))
			.bind(Entity.add({
				id: 'text' + id,
				pos: Point.make(pos.x, pos.y - 10),
				geometry: {
					type: 'text',
					text: text,
					size: 1.7,
					align: 'center',
					border: 0
				},
				color: Colors.Button.TEXT,
				z: 11
			}));
		};
	}	

	return exports;
})(Button || {});