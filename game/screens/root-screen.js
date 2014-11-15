var RootScreen = (function(exports) {
	function makeScreen(template) {
		if (Array.isArray(template)) {
			return SequenceScreen.make(template.map(function(seqScreenTemplate) {
				return makeScreen(seqScreenTemplate);
			}));
		} else if (template.repeat) {
			return RepeatScreen.make(makeScreen(template.repeat));
		} else if (template.repeatUntil) {
			var screen = template.repeatUntil.screen;
			return RepeatScreen.make(makeScreen(screen), template.repeatUntil.termCondition);
		} else if (template.if) {
			var first = makeScreen(template.if.first);
			var second = makeScreen(template.if.second);
			return IfScreen.make(first, second, template.if.condition);
		} else {
			return template;
		}
	}

	exports.make = function(template) {
		return makeScreen(template);
	};

	return exports;
})(RootScreen || {});