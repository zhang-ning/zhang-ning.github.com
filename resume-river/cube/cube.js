function Cube(cx, cy, l, w, h, angleV, angleH, type){//svg, 
	this.cx = cx;
	this.cy = cy;
	this.h = h;
	this.w = w;
	this.l = l;

	this.angleV = (angleV < 360) ? angleV : angleV%360 ;
	this.angleH = (angleH < 360) ? angleH : angleH%360 ;

	this.aspectColors = ["#F9DD5B", "#FE569D", "#FEB356", "#84ACD0", "#C2E173", "#B97C46"];
	this.lineColors = ["#F9DD5B", "#FE569D", "#FEB356", "#84ACD0", "#C2E173", "#B97C46", "red", "green", "blue", "black"];
	
	this.type = type ? type : Cube.TYPE_ASPECT1;

	this.g = document.createElementNS(drawer.svgns, "g");

	return this;
}

Cube.TYPE_ASPECT1 = 0;
Cube.TYPE_ASPECT2 = 1;
Cube.TYPE_LINE1 = 2;
Cube.TYPE_LINE2 = 3;

Cube.prototype.buildPoints = function(){
	if(this.angleV >= 360){
		this.angleV = this.angleV%360;
	}
	if(this.angleH >= 360){
		this.angleH = this.angleH%360;
	}
	var h = this.h, 
		w = this.w,
		l = this.l,
		cx = this.cx,
		cy = this.cy,
		angleV = this.angleV, 
		angleH = this.angleH;

	var ratio =  2 * Math.PI / 360;
	var h1 = h * Math.cos(angleV * ratio);

	var axisH = Math.sqrt(w * w + h * h);
	var axis_top = Math.sqrt(l * l + w * w);
	var angle_top = Math.atan(w / l) / ratio;
	var distance1 = 2 * Math.sin(1/2*angleH * ratio) * axis_top;
	var angleZ = Math.atan(w/h)/ratio;

	var angleD1 = 180 - angle_top - (180 - angleH)/2;
	var distanceX1 = Math.cos(angleD1 * ratio) * distance1;
	var distanceY1 = Math.sin(angleD1 * ratio) * distance1;
	var distanceZ1 = Math.sin((angleZ + angleV) * ratio) * axisH;
	var diffZ1 = Math.cos(angleV * ratio) * distanceY1;
	distanceY1 = Math.sin((angleV)  * ratio) * distanceY1;

	var angleD2 = 180 - (90 - angle_top) - (180 - angleH)/2;
	var distanceX2 = distance1 * Math.sin(angleD2 * ratio);
	var distanceY2 = distance1 * Math.cos(angleD2 * ratio);
	var distanceZ2 = Math.sin((angleZ - angleV) * ratio) * axisH;
	var diffZ2 = distanceY2 * Math.cos(angleV * ratio);
	distanceY2 = distanceY2 * Math.sin(angleV * ratio);

	this.points= [];
	var HH1 = Math.cos( (angleZ + angleV) * ratio) * axisH;
	var HH2 = Math.cos( (angleZ - angleV) * ratio) * axisH;
	var point = {	x0: (-l - distanceX1), 
					y0: (HH1 + distanceY1), 
					z0: (distanceZ1 - diffZ1)
				};
	this.points.push(point);

	point = {	x0: (l - distanceX2), 
				y0: (HH1 - distanceY2), 
				z0: (distanceZ1 + diffZ2)
			};
	this.points.push(point);

	point = {	x0: (l + distanceX1), 
				y0: (HH2 - distanceY1), 
				z0: (-distanceZ2 + diffZ1)
			};
	this.points.push(point);

	point = {	x0: (-l + distanceX2), 
				y0: (HH2 + distanceY2), 
				z0: (-distanceZ2 - diffZ2)
			};
	this.points.push(point);

	point = {	x0: this.points[0].x0, y0: this.points[0].y0 - 2*h1, z0: -this.points[2].z0};
	this.points.push(point);

	point = {	x0: this.points[1].x0, y0: this.points[1].y0 - 2*h1, z0: -this.points[3].z0};
	this.points.push(point);

	point = {	x0: this.points[2].x0, y0: this.points[2].y0 - 2*h1, z0: -this.points[0].z0};
	this.points.push(point);

	point = {	x0: this.points[3].x0, y0: this.points[3].y0 - 2*h1, z0: -this.points[1].z0};
	this.points.push(point);

	for(var i = 0; i< 8; i++){
		point = this.points[i];
		point.x = this.cx + point.x0;
		point.y = this.cy - point.y0;
	}

	this.top_cx = this.cx;
	this.top_cy = this.cy - Math.cos(this.angleV * ratio) * this.h;

	this.aspectPoints = [
		[this.points[0],
		 this.points[1],
		 this.points[5],
		 this.points[4]
		],
		[this.points[1],
		 this.points[2],
		 this.points[6],
		 this.points[5]
		],
		[this.points[2],
		 this.points[3],
		 this.points[7],
		 this.points[6]
		],
		[this.points[3],
		 this.points[0],
		 this.points[4],
		 this.points[7]
		],
		[this.points[0],
		 this.points[1],
		 this.points[2],
		 this.points[3]
		],
		[this.points[4],
		 this.points[5],
		 this.points[6],
		 this.points[7]
		]
	];

	this.isVisible();
	this.isVisibleAspects();
}

Cube.prototype.isVisible = function(){
	var point;
	var minz0 = this.points[0].z0;
	for(var i = 0; i < 8; i++){
		point = this.points[i];
		if(point.z0 <= minz0){
			minz0 = point.z0;
		}
	}
	//console.log("minz0: " + minz0);
	for(var i = 0; i < 8; i++){
		point = this.points[i];
		if(point.z0 <= minz0){
			point.visible = false;
		}else{
			point.visible = true;
		}
	}
}

Cube.prototype.isVisibleAspects = function(){
	var points,
		visible,
		invisibles = [],
		visibles = [];

	for(var i = 0; i < 6; i++){
		points = this.aspectPoints[i];
		visible = true;
		for(var ii = 0; ii < 4; ii++){
			if(!points[ii].visible){
				visible = false;
				break;
			}
		}
		if(!visible){
			invisibles.push(i);
		}else{
			visibles.push(i);
		}
	}

	this.invisibles = invisibles;
	this.visibles = visibles;
}

Cube.prototype.draw = function(){
	this.buildPoints();
	if(this.type === Cube.TYPE_ASPECT1 || this.type === Cube.TYPE_ASPECT2){
		this.drawInAspects();
	}else if(this.type === Cube.TYPE_LINE1 || this.type === Cube.TYPE_LINE2){
		this.drawInLines();
	}
	return this;
}

Cube.prototype.redraw = function(cx, cy, l, w, h, angleV, angleH){
	if(cx){
		this.cx = cx;
	}
	if(cy){
		this.cy = cy;
	}
	if(l){
		this.l = l;
	}
	if(w){
		this.w = w;
	}
	if(h){
		this.h = h;
	}
	if(angleV){
		this.angleV = angleV;
	}
	if(angleH){
		this.angleH = angleH;
	}

	drawer.clearSvg(this.g);//TBD //Without replaceChild, as I am still using the same g
	this.draw();

	return this;
}

Cube.prototype.drawInLines = function(){
	this.line(0, 4, 0);
	this.line(1, 5, 1);
	this.line(2, 6, 2);
	this.line(3, 7, 3);
	this.line(0, 1, 4);
	this.line(1, 2, 5);
	this.line(2, 3, 6);
	this.line(3, 0, 7);
	this.line(4, 5, 8);
	this.line(5, 6, 9);
	this.line(6, 7, 10);
	this.line(7, 4, 11);
}

Cube.prototype.line = function(i, j, k){
	var line = drawer.drawLine(this.points[i].x, this.points[i].y, this.points[j].x, this.points[j].y, this.g, this.lineColors[k]);
	if(!this.points[i].visible || !this.points[j].visible){
		if(this.type == Cube.TYPE_LINE1){
			line.setAttribute("class", "back0");
		}else{
			line.setAttribute("class", "back1");
		}
	}
}

Cube.prototype.drawInAspects = function(){
	var invisibles = this.invisibles,
		visibles = this.visibles;

	if(this.type === Cube.TYPE_ASPECT1){
		for(i = invisibles.length - 1; i >= 0; i--){
			this.aspect(invisibles[i]).setAttribute("class", "back");
		}
	}else{
		for(i = invisibles.length - 1; i >= 0; i--){
			this.aspect(invisibles[i]);
		}
	}

	for(i = visibles.length - 1; i >= 0; i--){
		this.aspect(visibles[i]);
	}

}

Cube.prototype.aspect = function(id){
	var points = this.aspectPoints[id], 
		color = this.aspectColors[id];

	var polygon = document.createElementNS(drawer.svgns, "polygon");
	var trace = "";
	for(var i = 0, len = points.length; i < len; i++){
		trace += points[i].x + "," + points[i].y + " ";
	}

	polygon.setAttribute("points", trace);
	polygon.setAttribute("fill", color);
	polygon.setAttribute("stroke", "none");
	polygon.setAttribute("class", "cube-polygon");

	this.g.appendChild(polygon);
	return polygon;
}

Cube.prototype.rotateH = function(by){
	var self = this;
	clearInterval(this.cube_interval);
	this.cube_interval = setInterval(function(){
		self.redraw(self.cx, self.cy, self.l, self.w, self.h, self.angleV, self.angleH + by);
	}, 100)
}

Cube.prototype.rotateV = function(by){
	var self = this;
	clearInterval(this.cube_interval);
	this.cube_interval = setInterval(function(){
		self.redraw(self.cx, self.cy, self.l, self.w, self.h, self.angleV + by, self.angleH);
	}, 100)
}

Cube.prototype.stepH = function(by){
	this.redraw(this.cx, this.cy, this.l, this.w, this.h, this.angleV, this.angleH + by);
}

Cube.prototype.stepV = function(by){
	this.redraw(this.cx, this.cy, this.l, this.w, this.h, this.angleV + by, this.angleH);
}

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

drawer.drawLine = function(x1, y1, x2, y2, g, color){
	var line = document.createElementNS(drawer.svgns, "line");
	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke-width", 1);
	line.setAttribute("stroke", color);
	g.appendChild(g);
	return line;
}


var cube,
	svg,
	angleH = 15,
	angleV = 15,
	l = 45,
	w = 45,
	h = 45,
	cx = 400,
	cy = 150;

function demoCube(){
	svg = document.getElementById("cube_svg");
	cube = new Cube(cx, cy, l, w, h, angleV, angleH, 0);
	cube.draw();
	svg.appendChild(cube.g);
	cube.rotateH(1)
}

function stopRotate (argument) {
	clearInterval(cube.cube_interval);
}

function demoH (argument) {
	clearInterval(cube.cube_interval);
	svg = document.getElementById("cube_svg");
	drawer.clearSvg(svg);
	var my_cx = 80,
		type = Number(document.getElementById("cube_type").value);
	for(var i = 0; i < 6; i++){
		cube = new Cube(my_cx, cy, l, w, h, angleV, angleH, type);
		cube.draw();
		svg.appendChild(cube.g);
		angleH += 30;
		my_cx += 2.7 * l;
	}
}

function demoV (argument) {
	clearInterval(cube.cube_interval);
	svg = document.getElementById("cube_svg");
	drawer.clearSvg(svg);
	var my_cx = 80,
		type = Number(document.getElementById("cube_type").value);
	for(var i = 0; i < 6; i++){
		cube = new Cube(my_cx, cy, l, w, h, angleV, angleH, type);
		cube.draw();
		svg.appendChild(cube.g);
		angleV += 30;
		my_cx += 2.7 * l;
	}
}
