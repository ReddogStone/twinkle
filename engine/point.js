var Point = (function(exports) {

	exports.make = function(x, y) {
		return { x: x, y: y };
	};

	exports.clone = function(point) {
		return exports.make(point.x, point.y);
	};

	exports.inRect = function(point, rect) {
		var dx = point.x - rect.x;
		var dy = point.y - rect.y;
		return (dx >= 0) && (dx < rect.sx) && (dy >= 0) && (dy < rect.sy);	
	};

	exports.inCircle = function(point, pos, radius) {
		var dx = point.x - pos.x;
		var dy = point.y - pos.y;
		return ((dx * dx + dy * dy) < radius * radius);
	};

	exports.closeToLine = function(point, p1, p2, maxDist) {
		var dx = point.x - p1.x;
		var dy = point.y - p1.y;
		var vx = p2.x - p1.x;
		var vy = p2.y - p1.y;
		var l = exports.dist(p1, p2);
		var dot = dx * vx + dy * vy;
		var distToLine = dot / l;
		return distToLine < maxDist;
	};

	exports.sqDist = function(p1, p2) {
		var dx = p2.x - p1.x;
		var dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	};

	exports.dist = function(p1, p2) {
		return Math.sqrt(exports.sqDist(p1, p2));
	};

	return exports;
})(Rect || {});