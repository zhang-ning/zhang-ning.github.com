function VMBars (g, groups, options) {
	var bars = [];
	for(var i = 0, len1 = groups.length; i < len1; i++){
		var sheets = groups[i].groups;
		var x = options.X + i * (options.W + options.GAP) + options.GAP;
		var y = options.Y;
		var sheetBars = [];
		for(var j = 0, len2 = sheets.length; j < len2; j++){
			var pos = { x: x, y: y, w: options.W, h: sheets[j].value };
			y -= sheets[j].value;
			var barElm = drawer.rectV(pos.x, pos.y, pos.w, pos.h, {"fill": sheets[j].color});
			sheetBars.push({pos: pos, elm: barElm, val: sheets[j].value});
			g.appendChild(barElm);
		}
	}
}

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
function createHBars(g, groups, options) {
	var bars = [];	
	var barElm;
	var pos;
	for(var i = 0, len = groups.length; i < len; i++){
		pos = { x: options.X, 
				y: options.Y + i * (options.H + options.GAP) + options.GAP, 
				w: groups[i].value, 
				h: options.H };
		barElm = drawer.rectH(pos.x, pos.y, pos.w, pos.h, {"fill": groups[i].color});
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

function getHostsChartData () {
	return HOST_GROUPS;
}
function getEnginesChartData (){
	return ENGINE_GROUPS;
}
function getEnginesMChartData () {
	return ENGINE_GROUPS_M;
}
function getLinesChartData () {
	return LINES_GROUPS_M;
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
	var axisOptions = {"stroke": "green", "stroke-width": STROKE_WIDTH};
	var line = drawer.drawLine(0, height - 1/2*STROKE_WIDTH, width, height - 1/2*STROKE_WIDTH, axisOptions);
	g.appendChild(line);

	//Draw the bars
	var barsOptions = {X: 0, Y: height - STROKE_WIDTH, W: 10, GAP: GAP};
	createVBars(g, groups, barsOptions);

	//Draw the texts
	var textsOptions = {X: width, Y: 0, GAP: GAP};
	createTexts(g, groups, textsOptions);
}

function enginesHChart () {
	var GAP = 10;
	var STROKE_WIDTH = 2;

	var g = document.getElementById("engines-bars");
	var container = document.getElementById("engines-chart");
	var cStyle = Utils.getStyle(container);
	var width = Utils.getPxNum( cStyle.getPropertyValue("width") );
	var height = Utils.getPxNum( cStyle.getPropertyValue("height") );

	var groups = getEnginesChartData();

	//Draw the axis
	var axisOptions = {"stroke": "green", "stroke-width": STROKE_WIDTH};
	var line = drawer.drawLine(1/2*STROKE_WIDTH, 0, 1/2*STROKE_WIDTH, height, axisOptions);
	g.appendChild(line);

	//Draw the bars
	var barsOptions = {X: STROKE_WIDTH, Y: 0, H: 10, GAP: GAP};
	createHBars(g, groups, barsOptions);

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
	var axisOptions = {"stroke": "green", "stroke-width": STROKE_WIDTH};
	var line = drawer.drawLine(0, height - 1/2*STROKE_WIDTH, width, height - 1/2*STROKE_WIDTH, axisOptions);
	g.appendChild(line);

	//Draw the bars
	var barsOptions = {X: 0, Y: height - STROKE_WIDTH, W: 10, GAP: GAP};
	VMBars(g, groups, barsOptions);

	//Draw the texts
	/*var textsOptions = {X: width, Y: 0, GAP: GAP};
	createTexts(g, groups, textsOptions);*/
}

function hostsChart(){
	var g = document.getElementById("hosts-chart");
	var groups = getHostsChartData();
	var options = {g: g, r1: 60, r2: 42};
	var swimRing = new SwimRingChart(groups, options);
	console.log(swimRing);
	var runningArcGroups = [{
		color: swimRing.groups[1].color,
		angle: swimRing.groups[1].angle
	}];
	var runningArcOptions = {
		g: g,
		r1: 38,
		r2: 36,
		startangle: swimRing.startangle + swimRing.groups[0].angle
	};
	new SwimRingChart(runningArcGroups, runningArcOptions)
}

function swimRingM(){
	var groups = getEnginesMChartData();
	var totals = [];
	var angles = [];
	var amount = 0;
	var g = document.getElementById("hosts-chart-m");
	var r1 = 60;
	var r2 = 15;
	//var groupsFinal = [];
	//var options = [];
	for(var i = 0, len1 = groups.length; i < len1; i++){
		var total = 0;
		var sheets = groups[i].groups;
		for(var j = 0, len2 = sheets.length; j < len2; j++){
			total += sheets[j].value;
		}
		totals.push(total);
		amount += total;
	}
	var startangle = 0;
	for(var i = 0; i < len1; i++){
		var angle = ( totals[i] / amount ) * Math.PI * 2;
		angles.push(angle);

		//var items = [];
		var item = {};
		item.angle = angles[i];
		var lastR = r2;
		var option = {};
		for(var j = 0, len2 = groups[i].groups.length; j < len2; j++){
			item.color = groups[i].groups[j].color;
			//items.push([item]);
			option.startangle = startangle;
			option.r1 = (groups[i].groups[j].value / totals[i]) * (r1 - r2) + lastR;
			option.r2 = lastR;
			option.g = g;
			//options.push(option);
			lastR = option.r1;
			new SwimRingChart([item], option);
		}
		//groupsFinal.push(items);
		option = {g: g, r1: r1, r2: r2, startangle: startangle, strokeWidth: "4", disableActiveHandler: true};
		new SwimRingChart([{angle: angles[i], color: "transparent"}], option);
		startangle += angles[i];
	}
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

function stacksChart () {
	var stacksPublished_g = document.getElementById("stacks-published-g");
	var stacksActive_g = document.getElementById("stacks-active-g");
	var gStyle = Utils.getStyle(stacksPublished_g.parentNode);
	var width = Utils.getPxNum( gStyle.getPropertyValue("width") );
	var height = Utils.getPxNum( gStyle.getPropertyValue("height") );
	var r1 = 60;
	var r2 = 45;
	var cx = Math.floor( width / 4 );
	var cy = Math.floor( height / 2 );
	var options = { g: stacksPublished_g, r1: r1, r2: r2, cx: cx, cy: cy};
	new SwimRingChart(STACKS_PUBLISHED_GROUPS, options);

	cx = Math.floor( width / 4 * 3 );
	options = { g: stacksActive_g, r1: r1, r2: r2, cx: cx, cy: cy, startangle: (1/2 + 2/7/2)*Math.PI*2};
	new SwimRingChart(STACKS_ACTIVE_GROUPS, options);
}

function componentsChart () {
	var g = document.getElementById("components-g");
	var gStyle = Utils.getStyle(g.parentNode);
	var width = Utils.getPxNum( gStyle.getPropertyValue("width") );
	var height = Utils.getPxNum( gStyle.getPropertyValue("height") );
	var r1 = 60;
	var r2 = 40;
	cx = Math.floor( width / 2 );
	var cy = Math.floor( height / 2 );
	options = { g: g, r1: r1, r2: r2, cx: cx, cy: cy, startangle: (1/2 + 3/12/2)*Math.PI*2};
	new SwimRingChart(COMPONENTS_PUBLISHED_GROUPS, options);

	options = { g: g, r1: r2, r2: r2 - 10, cx: cx, cy: cy, startangle: (1/2 + 3/12/2)*Math.PI*2};
	new SwimRingChart(COMPONENTS_PENDING_GROUPS, options);
}


var ENGINE_GROUPS = [
	{title: "running", color: "purple", value: 100},
	{title: "paused", color: "green", value: 40},
	{title: "stopped", color: "orange", value: 60} 
];
var ENGINE_GROUPS_1 = [
	{title: "running", color: "orange", value: 10},
	{title: "stopped", color: "green", value: 20} 
];
var ENGINE_GROUPS_2 = [
	{title: "stopped", color: "purple", value: 40},
	{title: "running", color: "orange", value: 35},
	{title: "paused", color: "green", value: 20} 
];
var ENGINE_GROUPS_3 = [
	{title: "stopped", color: "purple", value: 30},
	{title: "running", color: "orange", value: 20},
	{title: "resume", color: "pink", value: 15},
	{title: "paused", color: "green", value: 10} 
];
var ENGINE_GROUPS_4 = [
	{title: "stopped", color: "purple", value: 25},
	{title: "paused", color: "green", value: 10},
	{title: "paused", color: "pink", value: 20}  
];
var ENGINE_GROUPS_M = [
	{title: "part 1", color: "purple", groups: ENGINE_GROUPS_1 },
	{title: "part 2", color: "orange", groups: ENGINE_GROUPS_2},
	{title: "part 3", color: "green", groups: ENGINE_GROUPS_3},
	{title: "part 4", color: "pink", groups: ENGINE_GROUPS_4 }
];
var LINES_GROUPS_M = [ 
	{color: "purple", groups: [70, 60, 75, 68, 72, 66, 80, 75] },
	{color: "orange", groups: [55, 40, 60, 65, 70, 50, 80, 70] },
	{color: "green", groups: [35, 20, 35, 40, 50, 40, 45, 35] },
	{color: "pink", groups: [5, 2, 15, 10, 22, 8, 12, 10] }
];

var HOST_GROUPS = [
	{title: "running", color: "pink", value: 4},
	{title: "stopped", color: "green", value: 10} 
];

var STACKS_PUBLISHED_GROUPS = [
	{title: "running", color: "purple", value: 10},
	{title: "stopped", color: "#c2c2c2", value: 4} 
];
var STACKS_ACTIVE_GROUPS = [
	{title: "running", color: "#c2c2c2", angle: 2/7 * Math.PI * 2},
	{title: "stopped", color: "orange", angle: 3/7 * Math.PI * 2} 
];
var COMPONENTS_PUBLISHED_GROUPS = [
	{title: "running", color: "brown", angle: 8/12 * Math.PI * 2},
	{title: "stopped", color: "blue", angle: 1/12 * Math.PI * 2} 
];
var COMPONENTS_PENDING_GROUPS = [
	{title: "stopped", color: "green", angle: 2/12 * Math.PI * 2} 
];

/*enginesVChart();
enginesHChart();
enginesVMChart();
hostsChart();
swimRingM();
linesChart();
stacksChart();
componentsChart();

waterfall();*/


