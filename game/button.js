var Button = (function(exports) {
	exports.make = function(id, pos, size, text, onClick, seed) {
		var cloud = UIUtils.animatedCloud(id, pos, size, 10, seed);
		cloud.material.color = Colors.BUTTON;
		cloud.highlightable = true;

		var button = Utils.setPropObj(cloud, 'button', { pressed: false, onClick: onClick });
		var text = {
			id: 'text' + id,
			pos: Point.make(pos.x, pos.y - 10),
			geometry: {
				type: 'text',
				text: text,
				size: 1.7,
				align: 'center',
				border: { width: 0 }
			},
			material: {
				color: Colors.BUTTON_TEXT,
				renderScript: {
					id: 'game/assets/render-scripts/text.js',
					mode: 'default'
				}
			},
			z: 11
		};
		return [button, text];
	};

	return exports;
})(Button || {});