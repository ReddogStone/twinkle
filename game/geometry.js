var Geom = (function(exports) {

	exports.drawBox = function(context, pos, size, borderWidth, color, borderColor) {
		context.fillStyle = color;
		context.strokeStyle = 'black';
		context.lineWidth = borderWidth;
		context.beginPath();
		context.rect(pos.x, pos.y, size.x, size.y);
		context.fill();
		context.stroke();
	};

	exports.drawCircle = function(context, pos, radius, borderWidth, color, borderColor) {
		context.fillStyle = color;
		context.strokeStyle = 'black';
		context.lineWidth = borderWidth;
		context.beginPath();
		context.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
		context.fill();
		context.stroke();
	};

	exports.drawLine = function(context, p1, p2, width, color) {
		context.strokeStyle = color;
		context.lineWidth = width;
		context.beginPath();
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		context.stroke();
	};

	exports.drawArrow = function(context, p1, p2, width, color) {
		var angle = 0.05 * Math.PI;
		var headSize = 20;
		var headOffset = 15;

		var s = Math.sin(angle);
		var c = Math.cos(angle);

		var dist = Point.dist(p1, p2);
		if (dist < 2 * headOffset) {
			return;
		}

		var vx = (p1.x - p2.x) / dist;
		var vy = (p1.y - p2.y) / dist;

		var endX = p2.x + vx * headOffset;
		var endY = p2.y + vy * headOffset;

		var rot1x = c * vx - s * vy;
		var rot1y = c * vy + s * vx;
		var rot2x = c * vx + s * vy;
		var rot2y = c * vy - s * vx;

		var head1x = endX + rot1x * headSize;
		var head1y = endY + rot1y * headSize;
		var head2x = endX + rot2x * headSize;
		var head2y = endY + rot2y * headSize;

		context.strokeStyle = color;
		context.lineWidth = width;

		context.beginPath();
		context.moveTo(p1.x, p1.y);
		context.lineTo(endX, endY);
		context.stroke();

		context.fillStyle = color;
		context.beginPath();
		context.moveTo(endX, endY);
		context.lineTo(head1x, head1y);
		context.lineTo(endX + vx * headOffset, endY + vy * headOffset);
		context.lineTo(head2x, head2y);
		context.closePath();
		context.fill();
	}

	exports.drawStar = function(context, pos, radius, points, borderWidth, color, borderColor) {
		context.fillStyle = color;
		context.strokeStyle = borderColor;
		context.lineWidth = borderWidth;
		context.beginPath();

		context.moveTo(pos.x + points[0].x * radius, pos.y + points[0].y * radius);
		for (var i = 1; i < points.length; i++) {
			var point = points[i];
			context.lineTo(pos.x + point.x * radius, pos.y + point.y * radius);
		}
		context.closePath();

		context.fill();

		if (borderWidth > 0) {
			context.stroke();
		}
	};

	exports.drawText = function(context, text, pos, size, align, borderWidth, color, borderColor) {
		context.font = 'normal ' + size + 'em Trebuchet';
		context.fillStyle = color;
		context.strokeStyle = borderColor;
		context.textAlign = align;
		context.lineWidth = borderWidth;
		context.textBaseline = 'middle';
		context.fillText(text, pos.x, pos.y);

		if (borderWidth > 0) {
			context.strokeText(text, pos.x, pos.y);
		}
	};

	exports.drawCloud = function(context, pos, size, circles, borderWidth, color, borderColor) {
		context.save();

		context.translate(pos.x, pos.y);
		context.scale(size.x, size.y);

		context.fillStyle = borderColor;
		for (var i = 0; i < circles.length; i++) {
			var circle = circles[i];
			context.beginPath();
			context.arc(circle.x, circle.y, circle.radius + borderWidth / size.y, 0, Math.PI * 2, true);
			context.fill();
		}

		context.fillStyle = color;
		for (var i = 0; i < circles.length; i++) {
			var circle = circles[i];
			context.beginPath();
			context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
			context.fill();
		}

		context.restore();
	};

	exports.createStar = function(rays, seed) {
		var prng = new Math.seedrandom(seed);
		var points = [];
		for (var i = 0; i < rays; i++) {
			var angle = i * 2 * Math.PI / rays;
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			var r = prng() * 0.4 + 0.6;
			points.push(Point.make(c * r, s * r));

			angle = (2 * i + 1) * Math.PI / rays;
			s = Math.sin(angle);
			c = Math.cos(angle);
			r = 0.3;
			points.push(Point.make(c * r, s * r));
		}
		return points;
	};

	exports.createCloud = function(parts, seed) {
		var prng = new Math.seedrandom(seed);
		var circles = [];
		var BASE_RADIUS = 0.4;

		var baseParts = Math.floor(parts * 0.5 - 0.5);
		var bellyParts = parts - baseParts;
		for (var i = 0; i < baseParts; i++) {
			var x = (i + 0.5) / baseParts - 0.5;
			var y = 0;
			circles.push({
				x: x,
				y: y,
				radius: BASE_RADIUS * (prng() * 0.2 + 0.8)
			});
		}
		for (var i = 0; i < bellyParts; i++) {
			var angle = -i * Math.PI / (bellyParts - 1);
			circles.push({
				x: Math.cos(angle) * 0.5,
				y: Math.sin(angle) * 0.5,
				radius: BASE_RADIUS * (prng() * 0.2 + 0.8)
			});
		}
		return circles;
	};

	exports.pointInside = function(point, pos, size, geom) {
		if (!geom) {
			return false;
		}
		switch (geom.type) {
			case 'rect': return Point.inRect(point, Rect.posSize(pos, Size.make(geom.sx, geom.sy)));
			case 'cloud': 
				var sx = size.x * 1.9;
				var sy = size.y * 1.6;
				return Point.inRect(point, 
					Rect.coords(pos.x - sx * 0.5, pos.y - sy * 0.6, sx, sy));
			case 'circle': return Point.inCircle(point, pos, geom.radius);
			case 'star': return Point.inCircle(point, pos, geom.radius);
		}
		return false;
	};

	exports.draw = function(context, positions, geometries, colors, highlighteds, zeds) {
		var ids = Object.keys(geometries).sort(function(id1, id2) {
			return zeds[id1] - zeds[id2];
		});

		for (var i = 0; i < ids.length; i++) {
			var id = ids[i];
			var geom = geometries[id];
			var pos = positions[id];
			var color = colors[id];
			var highlighted = highlighteds[id];
			switch (geom.type) {
				case 'rect':
					exports.drawBox(context, pos, Size.make(geom.sx, geom.sy), geom.border, color);
					break;
				case 'circle':
					exports.drawCircle(context, pos, geom.radius, geom.border, color);
					break;
/*				case 'star':
					exports.drawStar(context, pos, geom.radius, geom.points, 
						geom.border, color.primary, highlighted ? color.highlighted : color.secondary);
					break; */
				case 'line':
					exports.drawLine(context, geom.begin, geom.end, geom.width,
						highlighted ? color.highlighted : color.primary);
					break;
				case 'arrow':
					exports.drawArrow(context, geom.begin, geom.end, geom.width,
						highlighted ? color.highlighted : color.primary);
					break;
				case 'text':
					exports.drawText(context, geom.text, pos, geom.size, geom.align,
						geom.border, color.primary, color.secondary);
					break;
/*				case 'cloud':
					exports.drawCloud(context, pos, Size.make(geom.sx, geom.sy), geom.circles, 
						geom.border, color.primary, color.secondary);
					break; */
			}
		}
	};

	return exports;
})(Geom || {});