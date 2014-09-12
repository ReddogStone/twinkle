var HighlightSystem = (function(exports) {
	exports = Object.create(ComponentSystem);

	exports.onMouseDown = exports.onMouseMove = function(world, mousePos) {
		var highlighteds = UIUtils.getMouseOffsets(mousePos, world.pos,
			world.geometry, world.highlightable);
		return { 
			updates: {
				highlighted: Utils.mapObj(world.highlightable, function(id) {
					return !!highlighteds[id];
				})
			}
		};
	};

	return exports;
})(HighlightSystem || {});