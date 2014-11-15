var Time = (function(exports) {
	return window.performance ? performance : Date;
})(Time || {});