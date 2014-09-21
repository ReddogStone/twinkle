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
				if (begin !== end) {
					return Query.event('connection_closed', {
						begin: begin,
						end: end
					});
				}
			}

			return Query.event('connection_aborted');
		}
	};

	exports.onMouseMove = function(state, mousePos) {
		var halfConnector = Utils.mapObj(state.halfConnector, function(id, halfConnector) {
			return {
				begin: halfConnector.begin,
				end: Point.clone(mousePos)
			};
		});
		return Query.upsertComponents('halfConnector', halfConnector);
	};

	exports.update = function(state, deltaTime, time) {
		var halfConnectorLines = Utils.mapObj(state.halfConnector, function(id, halfConnector) {
			var line = state.geometry[id];
			var beginPos = state.pos[halfConnector.begin];
			return Utils.mergeObjects(line, {
				begin: beginPos,
				end: halfConnector.end
			});
		});
		var connectorLines = Utils.mapObj(state.connector, function(id, connector) {
			var line = state.geometry[id];
			var beginPos = state.pos[connector.begin];
			var endPos = state.pos[connector.end];
			return Utils.mergeObjects(line, {
				begin: beginPos,
				end: endPos
			});
		});
		var lines = Utils.mergeObjects(halfConnectorLines, connectorLines);
		return Query.upsertComponents('geometry', lines);
	};

	return exports;
})(ConnectorSystem || {});