var Screen = (function(exports) {
	exports.term = function(state, termSignal) {
		return { state: state, term: termSignal };
	};

	exports.state = function(state) {
		return { state: state };
	};

	return exports;
})(Screen || {});