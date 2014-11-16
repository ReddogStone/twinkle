var Colors = (function(exports) {

	exports.STAR = {
		primary: '#FBF7D4',
		secondary: '#8A834A',
		highlighted: 'cornflowerblue'
	};
	exports.DECOR_STAR = {
		primary: 'white'
	};
	exports.CONNECTOR = {
		primary: 'LightSteelBlue',
		highlighted: 'orangered'
	};
	exports.BUTTON = {
		normal: { primary: 'lightskyblue', secondary: '#6F7190' },
		hovered: { primary: 'lightskyblue', secondary: 'indianred' },
		pressed: { primary: 'cadetblue', secondary: 'brown' },
	};

	exports.BUTTON_TEXT = { primary: '#24274F' };
	exports.LOSE_TEXT = {
		primary: 'darkblue',
		secondary: 'darkblue'
	};
	exports.TITLE_TEXT = {
		primary: '#FBF7D4'
	};
	exports.LOSE_CLOUD = {
		primary: 'burlywood',
		secondary: '#6F7190'
	};
	exports.BACKGROUND = {
		primary: 'white',
		secondary: '#393C60'
	};

	return exports;
})(Colors || {});