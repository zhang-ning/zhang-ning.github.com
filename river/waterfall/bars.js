/*

function createVBars(g, groups, options) {
	var bars = [];	
	for(var i = 0, len = groups.length; i < len; i++){
		var pos = { x: options.X + i * (options.W + options.GAP) + options.GAP, 
				y: options.Y, 
				w: options.W, 
				h: groups[i].value };
		var barElm = drawer.rectV(pos.x, pos.y, pos.w, pos.h, {"fill": groups[i].color});
		bars.push({pos: pos, elm: barElm, val: groups[i].value});
		g.appendChild(barElm);


	}
	return bars;
}


function createTexts (g, groups, options) {
	var textOptions = { "text-anchor": "end" };
	var FONT_SIZE = 12;
	for(var i = 0, len = groups.length; i < len; i++){
		textOptions["fill"] = groups[i].color;
		var text = drawer.drawText(options.X, options.Y + FONT_SIZE + (FONT_SIZE + options.GAP) * i, groups[i].title, textOptions);
		g.appendChild(text);

		var rect = drawer.drawBar(options.X - 60, options.Y  + FONT_SIZE + (FONT_SIZE + options.GAP) * i , 10, 10, {"fill": groups[i].color});
		g.appendChild(rect);
	}
}
function enginesVChart() {
	var GAP = 10;
	var STROKE_WIDTH = 2;

	var g = document.getElementById("engines-bars-v");
	var container = document.getElementById("engines-chart-v");
	var cStyle = Utils.getStyle(container);
	var width = Utils.getPxNum( cStyle.getPropertyValue("width") );
	var height = Utils.getPxNum( cStyle.getPropertyValue("height") );

	var groups = getEnginesChartData();

	//Draw the axis
	var axisOptions = {"stroke": "#FE569D", "stroke-width": STROKE_WIDTH};
	var line = drawer.drawLine(0, height - 1/2*STROKE_WIDTH, width, height - 1/2*STROKE_WIDTH, axisOptions);
	g.appendChild(line);

	//Draw the bars
	var barsOptions = {X: 0, Y: height - STROKE_WIDTH, W: 10, GAP: GAP};
	var bars = createVBars(g, groups, barsOptions);

	//Draw the texts
	var textsOptions = {X: width, Y: 0, GAP: GAP};
	createTexts(g, groups, textsOptions);
}

function enginesVMChart() {
	var GAP = 10;
	var STROKE_WIDTH = 2;

	var g = document.getElementById("engines-bars-vm");
	var container = document.getElementById("engines-chart-vm");
	var cStyle = Utils.getStyle(container);
	var width = Utils.getPxNum( cStyle.getPropertyValue("width") );
	var height = Utils.getPxNum( cStyle.getPropertyValue("height") );

	var groups = getEnginesMChartData();

	//Draw the axis
	var axisOptions = {"stroke": "#FE569D", "stroke-width": STROKE_WIDTH};
	var line = drawer.drawLine(0, height - 1/2*STROKE_WIDTH, width, height - 1/2*STROKE_WIDTH, axisOptions);
	g.appendChild(line);

	//Draw the bars
	var barsOptions = {X: 0, Y: height - STROKE_WIDTH, W: 10, GAP: GAP};
	VMBars(g, groups, barsOptions);

}



function linesChart () {
	var g = document.getElementById("lines-chart");
	var groups = getLinesChartData();
	var GAP = 30;
	var MAXY = 120;
	for(var i = 0, len1 = groups.length; i < len1; i++){
		if(groups[i].groups.length > 0){
			var x = 0;
			var y = MAXY - groups[i].groups[0];//.value
			var trace = "M " + x + " " + y;
			for(var j = 1, len2 = groups[i].groups.length; j < len2; j++){
				x += GAP;
				y = MAXY - groups[i].groups[j];//.value
				trace += " L " + x + " " + 	y;
			}
			var line = document.createElementNS(drawer.svgns, "path");
			line.setAttribute("d", trace);
			line.setAttribute("stroke", groups[i].color);
			line.setAttribute("stroke-width", "2");
			line.setAttribute("fill", "none");
			g.appendChild(line);
		}
	}
}


*/

function  HBars (groups, options) {
	this.groups = groups;
	this.g = options.g;
	this.options = options;
	this.bars = [];
	this.texts = [];

	this.hBars();
	this.axises();
}
HBars.GAP_X = 8;
HBars.GAP_H = 5;
HBars.STROKE_WIDTH = 4;
HBars.PIECE = 8;
HBars.SPEED = 16;

HBars.prototype.hBars = function(){
	var elm;
	var pos;
	var baseBar;
	for(var i = 0, len = this.groups.length; i < len; i++){
		pos = { x: this.options.X, 
				y: this.options.Y + i * (this.options.H + this.options.GAP) + this.options.GAP, 
				w: this.groups[i].value, 
				h: this.options.H };
		elm = drawer.rectH(pos.x, pos.y, pos.w, pos.h, {"fill": this.groups[i].color});
		baseBar = drawer.rectH(pos.x, pos.y + (this.options.H - this.options.BASE_BAR_H)/2, this.options.BASE_BAR_W, this.options.BASE_BAR_H);
		baseBar.setAttribute("class", "base-bar");
		this.bars.push({pos: pos, elm: elm, val: this.groups[i].value});
		this.g.appendChild(baseBar);
		this.g.appendChild(elm);
	}
}
HBars.prototype.axises = function (){
	for(var i = 0, len = this.bars.length; i < len; i++){
		var pos = this.bars[i].pos;
		var x1 = pos.x - HBars.GAP_X - 1/2 * HBars.STROKE_WIDTH;
		var y1 = pos.y - HBars.GAP_H;
		var x2 = x1;
		var y2 = y1 + pos.h + 2 * HBars.GAP_H;
		var line = drawer.drawLine(x1, y1, x1, y2);
		line.setAttribute("class", "base-line");
		this.g.appendChild(line);

		var text = drawer.drawText(pos.x - 2 * HBars.GAP_X - HBars.STROKE_WIDTH, pos.y + pos.h, this.groups[i].title);
		text.setAttribute("class", "h-bar-title");
		this.g.appendChild(text);

		var text = drawer.drawText(this.options.X + this.options.BASE_BAR_W + HBars.GAP_X, pos.y + pos.h, this.groups[i].value);
		text.setAttribute("class", "h-bar-value");
		this.g.appendChild(text);
		this.texts.push(text);
	}
}
HBars.prototype.update = function(groups){
	var total = this.getTotal(groups);
	var gaps = this.getGaps(groups, total);

	var count = 0;
	var self = this;
	var intervalId = setInterval( function(){
		count++;
		if(count < total){
			for(var i = 0, len = self.groups.length; i < len; i++){
				var bar = self.bars[i];
				var trace = drawer.rectHTrace( bar.pos.x, bar.pos.y, bar.pos.w + gaps[i] * count, bar.pos.h );
				bar.elm.setAttribute("d", trace);
			}
		}else{
			for(var i = 0, len = self.groups.length; i < len; i++){
				var bar = self.bars[i];
				var trace = drawer.rectHTrace( bar.pos.x, bar.pos.y, groups[i].value, bar.pos.h );
				bar.elm.setAttribute("d", trace);

				bar.pos.w = groups[i].value;
				bar.val = groups[i].value;
				self.texts[i].textContent = groups[i].value;
			}
			self.groups = groups;
			clearInterval(intervalId);
		}
	}, HBars.SPEED);

}
HBars.prototype.getTotal = function(groups){
	var max = 0;
	for(var i = 0, len = groups.length; i < len; i++){
		if(Math.abs(groups[i].value - this.groups[i].value) > max){
			max = Math.abs(groups[i].value - this.groups[i].value);
		}
	}
	var total = max / HBars.PIECE;
	return total;
}
HBars.prototype.getGaps = function(groups, total){
	var gaps = [];
	for(var i = 0, len = groups.length; i < len; i++){
		gaps.push( ( groups[i].value - this.groups[i].value ) / total );
	}
	return gaps;
}



