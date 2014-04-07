function hbarsDemo (){
	var BAR_H = 10;
	var GAP = 1.5 * 10;
	var START_X = 100;
	var STROKE_WIDTH = 2;
	var VALUE_W = 80;

	var g = document.getElementById("hbars-g");
	var width = Number( g.parentNode.getAttribute("width") );
	var groups = ENGINE_GROUPS;
	var barsOptions = { g: g,
						X: STROKE_WIDTH + START_X, 
					    Y: 0, 
					    H: BAR_H, 
					    GAP: GAP,
					    BASE_BAR_H: BAR_H - 2,
					    BASE_BAR_W: 200,
					    VALUE_START:  width - VALUE_W
					  };
	return new HBars(groups, barsOptions);
}

function vbarsDemo (){
	var BAR_W = 10;
	var GAP = 2 * 10;
	var g = document.getElementById("vbars-g");
	var height = Number( g.parentNode.getAttribute("height") );
	var groups = ENGINE_GROUPS;
	var barsOptions = { g: g,
						X: 50, 
					    Y: height - 50, 
					    W: BAR_W, 
					    GAP: GAP,
					    BASE_BAR_W: BAR_W - 2,
					    BASE_BAR_L: 120
					  };
	return new VBars(groups, barsOptions);
}

function vmbarsDemo (){
	var BAR_W = 10;
	var GAP = 2 * 10;
	var g = document.getElementById("vmbars-g");
	var height = Number( g.parentNode.getAttribute("height") );
	var groups = ENGINE_GROUPS_M;
	var barsOptions = { g: g,
						X: 50, 
					    Y: height - 50, 
					    W: BAR_W, 
					    GAP: GAP,
					    BASE_BAR_W: BAR_W - 2,
					    BASE_BAR_L: 200
					  };
	return new VMBars(groups, barsOptions);
}

function ringDemo(){
	var g = document.getElementById("ring-svg");
	var groups = HOST_GROUPS;
	var options = {g: g, r1: 60, r2: 50};
	var swimRing = new SwimRingChart(groups, options);
	console.log(swimRing);
	var FruitArcGroups = [{
		color: swimRing.groups[1].color,
		angle: swimRing.groups[1].angle
	}];
	return swimRing;
}

function mringDemo(){
	var options = { g: document.getElementById("mring-svg"), 
		r1: 80,
		r2: 10
	};
	var groups = ENGINE_GROUPS_M;
	return new MRing(groups, options);
}
//"#F9DD5B", "#FE569D", "#FEB356", "#84ACD0", "#C2E173", "#B97C46"

var ENGINE_GROUPS = [
	{title: "Fruit", color: "#F9DD5B", value: 64}
	,{title: "Rice", color: "#FE569D", value: 28}
	,{title: "Flowers", color: "#FEB356", value: 50}
	,{title: "Water", color: "#84ACD0", value: 78}
	,{title: "Vegitable", color: "#C2E173", value: 20}
	,{title: "Grass", color: "#B97C46", value: 40} 
];
var ENGINE_GROUPS_1 = [
	{title: "Fruit", color: "#FEB356", value: 40},
	{title: "Rice", color: "#84ACD0", value: 20} 
];
var ENGINE_GROUPS_2 = [
	{title: "Fruit", color: "#84ACD0", value: 40},
	{title: "Rice", color: "#FEB356", value: 45},
	{title: "Flowers", color: "#C2E173", value: 25},
	{title: "Water", color: "#FE569D", value: 30} 
];
var ENGINE_GROUPS_3 = [
	{title: "Fruit", color: "#84ACD0", value: 30},
	{title: "Rice", color: "#FEB356", value: 20},
	{title: "Flowers", color: "#C2E173", value: 35},
	{title: "Water", color: "#B97C46", value: 25} 
];
var ENGINE_GROUPS_4 = [
	{title: "Fruit", color: "#84ACD0", value: 45},
	{title: "Rice", color: "#C2E173", value: 30},
	{title: "Flowers", color: "#FE569D", value: 10}  
];
var ENGINE_GROUPS_M = [
	{title: "Fruit", color: "#84ACD0", groups: ENGINE_GROUPS_1 },
	{title: "Rice", color: "#FEB356", groups: ENGINE_GROUPS_2},
	{title: "Flowers", color: "#C2E173", groups: ENGINE_GROUPS_3},
	{title: "Vegitable", color: "#B97C46", groups: ENGINE_GROUPS_4 }
];
var LINES_GROUPS_M = [ 
	{color: "#F9DD5B", groups: [70, 60, 75, 68, 72, 66, 80, 75] },
	{color: "#FEB356", groups: [55, 40, 60, 65, 70, 50, 80, 70] },
	{color: "#FE569D", groups: [35, 20, 35, 40, 50, 40, 45, 35] },
	{color: "#C2E173", groups: [5, 2, 15, 10, 22, 8, 12, 10] }
];
//"#F9DD5B", "#FE569D", "#FEB356", "#84ACD0", "#C2E173", "#B97C46"
var HOST_GROUPS = [
	{title: "Fruit", color: "#F9DD5B", value: 4}
	,{title: "Rice", color: "#FE569D", value: 8}
	//,{title: "Flowers", color: "#FEB356", value: 20}
	,{title: "Water", color: "#84ACD0", value: 8}
	,{title: "Vegitable", color: "#C2E173", value: 20}
	//,{title: "Grass", color: "#B97C46", value: 10} 
];

var hbars = hbarsDemo();
var vbars = vbarsDemo();
var vmbars = vmbarsDemo();
var ring = ringDemo();
var mring = mringDemo();

function refreshRing(){
	var groups = [];
	for(var i = 0, len = ring.groups.length; i < len; i++){
		var group = _cloneGroup( ring.groups[i] );
		group.value = Math.floor( Math.random() * 100 );
		delete group.angle;
		groups.push(group);
	}
	ring.update(groups);
}

function refreshHBars(){
	var groups = [];
	for(var i = 0, len = hbars.groups.length; i < len; i++){
		var group = _cloneGroup( hbars.groups[i] );
		group.value = Math.floor( Math.random() * hbars.options.BASE_BAR_W );
		groups.push(group);
	}
	hbars.update(groups);
}
function refreshVBars(){
	var groups = [];
	for(var i = 0, len = vbars.groups.length; i < len; i++){
		var group = _cloneGroup( vbars.groups[i] );
		group.value = Math.floor( Math.random() * vbars.options.BASE_BAR_L );
		groups.push(group);
	}
	vbars.update(groups);
}
function refreshVMBars(){
	var groups = [];
	for(var i = 0, len = vmbars.groups.length; i < len; i++){
		var subGroups = [];
		for(var j = 0, len2 = vmbars.groups[i].groups.length; j < len2; j++){
			var subGroup = _cloneGroup( vmbars.groups[i].groups[j] );
			subGroup.value = Math.floor( Math.random() * vmbars.options.BASE_BAR_L / len2 );
			subGroups.push(subGroup);
		}
		groups.push({ title: vmbars.groups[i].title, groups: subGroups });
	}
	vmbars.update(groups);
}
function refreshMRing(){
	var groups = [];
	for(var i = 0, len = mring.groups.length; i < len; i++){
		var subGroups = [];
		for(var j = 0, len2 = mring.groups[i].groups.length; j < len2; j++){
			var subGroup = _cloneGroup( mring.groups[i].groups[j] );
			subGroup.value = Math.floor( Math.random() * 100 );
			subGroups.push(subGroup);
		}
		groups.push({ title: mring.groups[i].title, groups: subGroups });
	}
	mring.update(groups);
}

function _cloneGroup(group1){
	var group2 = {};
	for(var p in group1){
		group2[p] = group1[p];
	}
	return group2;
}

