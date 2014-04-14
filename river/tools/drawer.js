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
drawer.createLine = function(){
	var line = document.createElementNS(drawer.svgns, "line");
	return line;
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
/*drawer.getTrace = function(cx, cy, r1, r1, angle, startangle){
	var pos = drawer.getRingPos(startangle, startangle + angle);
	var big = (angle > Math.PI) ? 1 : 0;
	var d = "M " + pos.outStart.x + " " + pos.outStart.y + " A " + r1 + " " + r1 + " 0 " + big + " 1 " + pos.outEnd.x + " " + pos.outEnd.y + " L " + pos.innerEnd.x + " " + pos.innerEnd.y + " A " + r2 + " " + r2 + " 0 "+big+" 0 " + pos.innerStart.x + " " + pos.innerStart.y + " Z ";
	return d;
}
drawer.getRingPos = function(cx, cy, r1, r2, startangle, endangle){
	var x11 = Math.round( ( cx + r1 * Math.sin(startangle) ) * 100)/100;
	var y11 = Math.round( ( cy - r1 * Math.cos(startangle) ) * 100)/100;

	var x21 = Math.round( ( cx + r2 * Math.sin(startangle) ) * 100)/100;
	var y21 = Math.round( ( cy - r2 * Math.cos(startangle) ) * 100)/100;
	
	var x22 = Math.round( ( cx + r2 * Math.sin(endangle) ) * 100)/100;
	var y22 = Math.round( ( cy - r2 * Math.cos(endangle) ) * 100)/100;

	var x12 = Math.round( ( cx + r1 * Math.sin(endangle) ) * 100)/100;
	var y12 = Math.round( ( cy - r1 * Math.cos(endangle) ) * 100)/100;

	return { outStart: { x: x11, y: y11 },
			 innerStart: { x: x21, y: y21 },
			 outEnd: { x: x12, y: y12 },
			 innerEnd: { x: x22, y: y22  }
		   };
}*/



