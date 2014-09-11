var StateMonad = (function(exports) {
	var StateMonadProto = {
		bind: function(mFunc) {
			var runState = this.runState;
			return exports.make(function(state) {
				var newValueAndState = runState(state);
				return mFunc(newValueAndState.value).runState(newValueAndState.state);
			});
		},
		evalState: function(initState) {
			return this.runState(initState).value;
		},
		execState: function(initState) {
			return this.runState(initState).state;
		}
	};

	exports.make = function(mValue) {
		var res = Object.create(StateMonadProto);
		res.runState = mValue;
		return res;
	}
	exports.ret = function(value) {
		return exports.make(function(state) {
			return { value: value, state: state };
		});
	}

	return exports;
})(StateMonad || {});