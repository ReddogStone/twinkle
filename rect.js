var Rect = (function(exports) {

	exports.coords = function(x, y, sx, sy) {
		return { x: x, y: y, sx: sx, sy: sy };
	}
	exports.corners = function(topLeft, bottomRight) {
		return exports.coords(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
	};
	exports.posSize = function(topLeft, size) {
		return exports.coords(topLeft.x, topLeft.y, size.x, size.y);
	};

	return exports;
})(Rect || {});