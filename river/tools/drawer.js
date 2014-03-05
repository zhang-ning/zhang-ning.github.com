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
drawer.createLine = function(strokeWidth, color) {
	var line = document.createElementNS(drawer.svgns, "line");
	line.setAttribute("stroke-width", strokeWidth || 1);
	line.setAttribute("stroke", color || "black");
	return line;
}
drawer.drawLine = function(x1, y1, x2, y2, g, color){
	var line = drawer.createLine(strokeWidth, color);
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	g.appendChild(line);
	return line;
}
drawer.updateLine = function(line, x1, y1, x2, y2) {
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
}

drawer.drawBar = function(x, y, w, h) {
	var bar = document.createElementNS(drawer.svgns, "path");
	bar.setAttribute("d", drawer.barPath(x, y, w, h));
	return bar;
}
drawer.barPath = function(x, y, w, h) {
	return "M " + x + " " + y + " l 0 " + (-h) + " l " + w + " 0 l 0 " + h + " Z";
}