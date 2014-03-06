function demoTip () {
	var svgEle = document.getElementById("demoTipSVG"),
		pearsG = document.getElementById("pearsG"),
		tipG = document.getElementById("pearsG"),//tipG
		width = Number( svgEle.getAttribute("width").replace("px", 0) ),
		height = Number( svgEle.getAttribute("height").replace("px", 0) ),
		CR = 10;

	window.tipPath = document.getElementById("tipPath");
	window.tipText = document.getElementById("tipText");
	window.tipDemoSVGWidth = width;

	pears(pearsG, width, height, CR);
	tipG.appendChild(tipPath);
	showTip(pearsG.childNodes[9]);
}

function pears(g, width, height, CR){
	var centerX = 1/2*width,
		centerY = 1/2*height;
	var l = 1/2*width,
		h = 1/2*height,
		r = Math.sqrt(l*l + h*h);
	var axisX,
		axisY,
		angle,
		pearR,
		circle;
	for(var i = 0; i < 50; i++){
		x = Math.round(Math.random() * l);
		y = Math.round(Math.random() * h);
		angle = Math.round(Math.random() * 360);//
		pearR = Math.round(Math.random() * CR);
		(pearR < 3) && (pearR = 3);
		x = centerX + x * areaX(angle);
		y = centerY + y * areaY(angle);
		circle = pear(x, y, pearR);
		g.appendChild( circle );
		bindHover(circle);
	}
}
var SVGNS = "http://www.w3.org/2000/svg";
function pear(x, y, r){
	var circle = document.createElementNS(SVGNS, "circle");
	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("r", r);
	circle.setAttribute("stroke", "gray");
	circle.setAttribute("stroke-width", "1");
	circle.setAttribute("fill", "white");
	return circle;
}

/*function createTip(g){
	var path = document.createElementNS(SVGNS, "path");
	path.setAttribute("stroke", "gray");
	path.setAttribute("fill", "white");
	path.setAttribute("stroke-width", "1");
	return path;
}*/

function bindHover(circle){
	circle.addEventListener("mouseover", function(e){
		showTip(e.currentTarget);
	});
}

function showTip(circle){
	var x = Number(circle.getAttribute("cx"));
	var y = Number(circle.getAttribute("cy"));
	var r = circle.getAttribute("r");

	var trace = tipTrace(x, y, tipDemoSVGWidth);
	tipPath.setAttribute("d", trace.d);
	tipText.setAttribute("x", trace.tx);
	tipText.setAttribute("y", trace.ty);
	tipText.textContent = "cx=" + x + ", cy=" + y + ", r=" + r; 
}

function removeChildren(parent){
	var child = parent.firstChild;
	var nextSibling;
	while(child){
		nextSibling = child.nextSibling;
		parent.removeChild(child);
		child = nextSibling;
	}
}

function areaX(angle){
	if(angle >= 0 && angle <= 180){
		return 1
	}else return -1;
}

function areaY(angle){
	if((angle >=0 && angle <= 90) || (angle >= 270 && angle <= 360)){
		return 1;
	}else return -1;
}