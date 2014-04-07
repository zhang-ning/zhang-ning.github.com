var drawer = {};
drawer.svgns = "http://www.w3.org/2000/svg";
drawer.clearSvg = function(g){
	var child = g.firstChild,
	nextSibling;
	while(child){
		nextSibling = child.nextSibling;
		g.removeChild(child);
		child = nextSibling;
	}
}
drawer.createSVG = function(w, h) {
	var svg = document.createElementNS(drawer.svgns, "svg");
	svg.setAttribute("width", w);
	svg.setAttribute("height", h);
	return svg;
}
drawer.drawLine = function(x1, y1, x2, y2, options){
	var line = document.createElementNS(drawer.svgns, "line");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	drawer.setAttributes(line, options);
	return line;
}
drawer.updateLine = function(line, x1, y1, x2, y2) {
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
}
drawer.pathLine = function(x, y, w, h) {
	var path = document.createElementNS(drawer.svgns, "path");
	path.setAttribute("d", "M " + x + " " + y + " l " + (w || 0) + " " + (h || 0) );
	return path;
}
drawer.linePath = function(x, y, w, h) {
	return "M " + x + " " + y + " l " + (w || 0) + " " + (h || 0);
}
drawer.drawBar = function(x, y, w, h, options) {
	var bar = document.createElementNS(drawer.svgns, "path");
	bar.setAttribute("d", drawer.barPath(x, y, w, h));
	drawer.setAttributes(bar, options);
	return bar;
}
drawer.barPath = function(x, y, w, h) {
	return "M " + x + " " + y + " l 0 " + (-h) + " l " + w + " 0 l 0 " + h + " Z";
}
drawer.rectVTrace = function (x, y, w, h) {
	return "M " + x + " " + y + " l 0 " + (-h) + " l " + w + " 0 l 0 " + h + " Z";
}
drawer.rectHTrace = function (x, y, w, h) {
	return "M " + x + " " + y + " l " + w + " 0 l 0 " + h + " l -" + w + " 0 Z";
}
drawer.rectV = function (x, y, w, h, options) {
	var rect = document.createElementNS(drawer.svgns, "path");
	rect.setAttribute("d", drawer.rectVTrace(x, y, w, h));
	drawer.setAttributes(rect, options);
	return rect;
}
drawer.rectH = function (x, y, w, h, options) {
	var rect = document.createElementNS(drawer.svgns, "path");
	rect.setAttribute("d", drawer.rectHTrace(x, y, w, h));
	drawer.setAttributes(rect, options);
	return rect;
}
drawer.drawText = function (x, y, words, options) {
	var text = document.createElementNS(drawer.svgns, "text");
	text.setAttribute("x", x);
	text.setAttribute("y", y);
	text.textContent = words;
	drawer.setAttributes(text, options);
	return text;
}
drawer.setAttributes = function(path, options) {
	if(options){
		for(var p in options){
			path.setAttribute(p, options[p]);
		}
	}
}


