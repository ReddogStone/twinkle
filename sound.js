var Sound = (function(exports) {

	var DUPLICATES = 5;
	var pool = {};

	exports.init = function(sounds) {
		Utils.forEachObj(sounds, function(id, soundDesc) {
			pool[id] = [];
			for (var sourceIndex = 0; sourceIndex < soundDesc.sources.length; sourceIndex++) {
				var source = soundDesc.sources[sourceIndex];
				var variant = [];
				pool[id].push(variant);
				for (var i = 0; i < DUPLICATES; i++) {
					var sound = new Audio(source.url);
					sound.volume = source.volume || soundDesc.volume;
//					sound.loop = soundDesc.loop;
					sound.load();

					sound.addEventListener('ended', (function(desc) {
						return function() {
							if (desc.onEnded) {
								exports.play(desc.onEnded);
							}
						};
					})(soundDesc));

					variant.push(sound);
				}
			}
		});
	};

	exports.play = function(id) {
		var variants = pool[id];
		var variant = variants[Math.floor(Math.random() * variants.length)];

		var sound = variant.pop();
		variant.unshift(sound);

		sound.play();
	};

	return exports;
})(Sound || {});