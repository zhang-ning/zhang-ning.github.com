function enginesHChart (){
	var BAR_H = 10;
	var GAP = 1.5 * 10;
	var START_X = 100;
	var STROKE_WIDTH = 2;
	var VALUE_W = 80;

	var g = document.getElementById("engines-bars-g");
	var width = Number( g.parentNode.getAttribute("width") );
	var groups = getEnginesChartData();
	var barsOptions = { g: g,
						X: STROKE_WIDTH + START_X, 
					    Y: 0, 
					    H: BAR_H, 
					    GAP: GAP,
					    BASE_BAR_H: BAR_H - 2,
					    BASE_BAR_W: 200,//width - STROKE_WIDTH - START_X - VALUE_W
					    VALUE_START:  width - VALUE_W
					  };
	return new HBars(groups, barsOptions);
}

function hostsChart(){
	var g = document.getElementById("hosts-chart");
	var groups = getHostsChartData();
	var options = {g: g, r1: 60, r2: 50};
	var swimRing = new SwimRingChart(groups, options);
	console.log(swimRing);
	var FruitArcGroups = [{
		color: swimRing.groups[1].color,
		angle: swimRing.groups[1].angle
	}];
	return swimRing;
}

function stacksChart () {
	var stacksPublished_g = document.getElementById("stacks-published-g");
	var stacksActive_g = document.getElementById("stacks-active-g");
	var r1 = 60;
	var r2 = 50;
	var options = { g: stacksPublished_g, r1: r1, r2: r2};//, cx: cx, cy: cy
	var swimRing = new SwimRingChart(STACKS_PUBLISHED_GROUPS, options);

	options = { g: stacksActive_g, r1: r1, r2: r2, cx: swimRing.cx, cy: swimRing.cy, startangle: (1/2 + 2/7/2)*Math.PI*2};// cx: cx, cy: cy,
	new SwimRingChart(STACKS_ACTIVE_GROUPS, options);
}

function componentsChart () {
	var g = document.getElementById("components-g");
	var r1 = 70;
	var r2 = 60;
	options = { g: g, r1: r1, r2: r2, startangle: (1/2 + 3/12/2)*Math.PI*2};//, cx: cx, cy: cy
	var swimRing = new SwimRingChart(COMPONENTS_PUBLISHED_GROUPS, options);

	options = { g: g, r1: r2, r2: r2 - 10, cx: swimRing.cx, cy: swimRing.cy, startangle: (1/2 + 3/12/2)*Math.PI*2};//, cx: cx, cy: cy
	new SwimRingChart(COMPONENTS_PENDING_GROUPS, options);
}


var ENGINE_GROUPS = [
	{title: "initializing", color: "#F9DD5B", value: 100},
	{title: "available", color: "#FE569D", value: 40},
	{title: "Fruit", color: "#FEB356", value: 60} 
];
var ENGINE_GROUPS_1 = [
	{title: "Fruit", color: "#FEB356", value: 10},
	{title: "stopped", color: "#FE569D", value: 20} 
];
var ENGINE_GROUPS_2 = [
	{title: "stopped", color: "#F9DD5B", value: 40},
	{title: "Fruit", color: "#FEB356", value: 35},
	{title: "Rice", color: "#FE569D", value: 20} 
];
var ENGINE_GROUPS_3 = [
	{title: "stopped", color: "#F9DD5B", value: 30},
	{title: "Fruit", color: "#FEB356", value: 20},
	{title: "resume", color: "#84ACD0", value: 15},
	{title: "Rice", color: "#FE569D", value: 10} 
];
var ENGINE_GROUPS_4 = [
	{title: "stopped", color: "#F9DD5B", value: 25},
	{title: "Rice", color: "#FE569D", value: 10},
	{title: "Rice", color: "#84ACD0", value: 20}  
];
var ENGINE_GROUPS_M = [
	{title: "part 1", color: "#F9DD5B", groups: ENGINE_GROUPS_1 },
	{title: "part 2", color: "#FEB356", groups: ENGINE_GROUPS_2},
	{title: "part 3", color: "#FE569D", groups: ENGINE_GROUPS_3},
	{title: "part 4", color: "#84ACD0", groups: ENGINE_GROUPS_4 }
];
var LINES_GROUPS_M = [ 
	{color: "#F9DD5B", groups: [70, 60, 75, 68, 72, 66, 80, 75] },
	{color: "#FEB356", groups: [55, 40, 60, 65, 70, 50, 80, 70] },
	{color: "#FE569D", groups: [35, 20, 35, 40, 50, 40, 45, 35] },
	{color: "#84ACD0", groups: [5, 2, 15, 10, 22, 8, 12, 10] }
];

var HOST_GROUPS = [
	{title: "Fruit", color: "#84ACD0", value: 4},
	{title: "Rice", color: "#FEB356", value: 8},
	{title: "error", color: "#F9DD5B", value: 20},
	{title: "stopped", color: "#FE569D", value: 10} 
];

var STACKS_PUBLISHED_GROUPS = [
	{title: "Fruit", color: "#F9DD5B", value: 10},
	{title: "stopped", color: "#c2c2c2", value: 4} 
];
var STACKS_ACTIVE_GROUPS = [
	{title: "Fruit", color: "#c2c2c2", angle: 2/7 * Math.PI * 2},
	{title: "stopped", color: "#FEB356", angle: 3/7 * Math.PI * 2} 
];
var COMPONENTS_PUBLISHED_GROUPS = [
	{title: "Fruit", color: "brown", angle: 8/12 * Math.PI * 2},
	{title: "stopped", color: "blue", angle: 1/12 * Math.PI * 2} 
];
var COMPONENTS_PENDING_GROUPS = [
	{title: "stopped", color: "#FE569D", angle: 2/12 * Math.PI * 2} 
];

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



var hBars = enginesHChart();
var hostsRing = hostsChart();
stacksChart();
componentsChart();

function refreshHostsChart(){
	var groups = [];
	for(var i = 0, len = hostsRing.groups.length; i < len; i++){
		var group = _cloneGroup( hostsRing.groups[i] );
		group.value = Math.floor( Math.random() * 100 );
		delete group.angle;
		groups.push(group);
	}

	hostsRing.update(groups);
}

function refreshEnginesChart(){
	var groups = [];
	for(var i = 0, len = hBars.groups.length; i < len; i++){
		var group = _cloneGroup( hBars.groups[i] );
		group.value = Math.floor( Math.random() * hBars.options.BASE_BAR_W );
		groups.push(group);
	}

	hBars.update(groups);
}

function _cloneGroup(group1){
	var group2 = {};
	for(var p in group1){
		group2[p] = group1[p];
	}
	return group2;
}

