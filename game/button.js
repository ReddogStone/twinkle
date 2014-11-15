var Button = (function(exports) {
	exports.make = function(id, pos, size, text, onClick, seed) {
		var cloud = UIUtils.animatedCloud(id, pos, size, 10, seed);
		var button = Utils.setPropObj(cloud, 'button', { pressed: false, onClick: onClick });
		var text = {
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
		};
		return [button, text];
	};

	return exports;
})(Button || {});