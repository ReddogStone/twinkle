var ConnectorSystem = (function(exports) {
	exports = Object.create(ComponentSystem);

	exports.onMouseDown = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.geometry, world.star);
		var hoveredId = Object.keys(hovered)[0];
		if (hoveredId) {
			return {
				events: [{
					type: 'connection_started',
					startId: hoveredId,
					mousePos: Point.clone(mousePos)
				}]
			};
		}
		return {};
	};

	exports.onMouseUp = function(world, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, world.pos, world.geometry, world.star);
		var hoveredId = Object.keys(hovered)[0];
		var halfConnectorId = Object.keys(world.halfConnector)[0];
		if (halfConnectorId && hoveredId) {
			var halfConnector = world.halfConnector[halfConnectorId];

			var begin = halfConnector.begin;
			var end = hoveredId;
			if ((begin !== end) && !(world.neighbor[begin] && world.neighbor[begin][end]) ) {
				return { 
					events: [{
						type: 'connection_closed',
						begin: begin,
						end: end
					}]
				};
			}
		}

		return {
			events: [{
				type: 'connection_aborted'
			}]
		};
	};

	exports.onMouseMove = function(world, mousePos) {
		return {
			updates: {
				halfConnector: Utils.mapObj(world.halfConnector, function(id, halfConnector) {
					return {
						begin: halfConnector.begin,
						end: Point.clone(mousePos)
					};
				})
			}
		};
	};

	return exports;
})(ConnectorSystem || {});