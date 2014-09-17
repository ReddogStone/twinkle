var ConnectorSystem = (function(exports) {
	exports.onMouseDown = function(state, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, state.pos, state.geometry, state.star);
		var hoveredId = Object.keys(hovered)[0];
		if (hoveredId) {
			return Query.event('connection_started', {
				startId: hoveredId,
				mousePos: Point.clone(mousePos)
			});
		}
	};

	exports.onMouseUp = function(state, mousePos) {
		var hovered = UIUtils.getMouseOffsets(mousePos, state.pos, state.geometry, state.star);
		var hoveredId = Object.keys(hovered)[0];
		var halfConnectorId = Object.keys(state.halfConnector)[0];
		if (halfConnectorId) {
			if (hoveredId) {
				var halfConnector = state.halfConnector[halfConnectorId];

				var begin = halfConnector.begin;
				var end = hoveredId;
				if ((begin !== end) && !(state.neighbor[begin] && state.neighbor[begin][end]) ) {
					return Query.event('connection_closed', {
						begin: begin,
						end: end
					});
				}
			}

			return Query.event('connection_aborted');
		}
	};

	exports.onMouseMove = function(world, mousePos) {
		var halfConnector = Utils.mapObj(world.halfConnector, function(id, halfConnector) {
			return {
				begin: halfConnector.begin,
				end: Point.clone(mousePos)
			};
		});
		return Query.upsertComponents('halfConnector', halfConnector);
	};

	return exports;
})(ConnectorSystem || {});