var HighlightSystem = (function(exports) {
	exports.onMouseDown = exports.onMouseMove = function(world, mousePos) {
		var highlighteds = UIUtils.getMouseOffsets(mousePos, world.pos, world.size,
			world.geometry, world.highlightable);
		return Query.set('highlighted', highlighteds);
	};

	return exports;
})(HighlightSystem || {});