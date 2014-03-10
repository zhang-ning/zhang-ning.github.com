function  exchanging (bars, records, current) { 
	//console.log(current, records[current][0], records[current][1]);
	var one = bars[ records[current][0] ];
	var two = bars[ records[current][1] ];

	bars[ records[current][0] ] = two;
	bars[ records[current][1] ] = one;

	var distance = one.pos.x - two.pos.x ;
	var direction1 = distance > 0 ? -1 : 1;
	var direction2 = direction1 * -1;
	distance =  Math.abs(distance);
	var total = Math.ceil( distance / exchanging.PIECE );

	var finished = [false, false];
	moving(one, total, direction1, 0 );
	moving(two, total, direction2, 1 );

	function moving(it, total, direction, index) {
		var count = 1;
		var intervalRef = setInterval(function(){
			//console.log("moving...");
			if(count < total){
				move(it, it.pos.x + exchanging.PIECE * count * direction);
			}else if(count === total){
				it.pos.x = it.pos.x + distance * direction;
				move(it, it.pos.x);
			}
			count++;
			if(count > total){
				clearInterval(intervalRef);
				finished[index] = true;
				if(current < records.length - 1 && finished[0] && finished[1]){
					setTimeout(function() {
						exchanging(bars, records, ++current);
					}, exchanging.GAP_DONE );
				}else if(current >= records.length - 1){
					sortDone();
				}
			}
		}, exchanging.GAP_MOVING);
	}

	function move(it, gap){
		it.elm.setAttribute("d", drawer.barPath(gap, it.pos.y, it.pos.w, it.pos.h));
	}
}
exchanging.PIECE = 4;
exchanging.GAP = 16; 
exchanging.DISTANCEY = 100;
exchanging.GAP_MOVING = exchanging.GAP * 1;
exchanging.GAP_RATIO = 10;
exchanging.GAP_DONE = exchanging.GAP_MOVING * exchanging.GAP_RATIO;

function virtualizeQuickSort(a) {
	var g = document.getElementById("main_g");
	drawer.clearSvg(g);
	var bars = createBars(a, g);
	var records = demoQuickSort(a, g);
	exchanging(bars, records, 0);
}

function virtualizeBubbleSort(a) {
	var g = document.getElementById("main_g");
	drawer.clearSvg(g);
	var bars = createBars(a, g);
	var records = demoBubbleSort(a, g);
	exchanging(bars, records, 0);
}

function createBars(a, g) {
	var bars = [];	
	var barElm;
	var pos;
	for(var i = 0, len = a.length; i < len; i++){
		pos = { x: createBars.X + i * (createBars.W + createBars.GAP) + createBars.GAP, 
				y: createBars.Y, 
				w: createBars.W, 
				h: a[i] };//createBars.H * 
		barElm = drawer.drawBar(pos.x, pos.y, pos.w, pos.h);
		bars.push({pos: pos, elm: barElm, val: a[i]});
		g.appendChild(barElm);
		//drawer.drawLine(0, y- h*a[i], 500, y- h*a[i], g, "#efefef")
	}
	return bars;
}
createBars.X = 10;
createBars.Y = exchanging.DISTANCEY + 50;
createBars.W = 6;
createBars.GAP = createBars.W;
createBars.MIN_W = 2;
createBars.MIN_X = 10;

var sortType = "quickSort";
var a = [];
var SORT_NUM;
var SORT_SPEED;

function sortPrepare() {
	randomArray();
	setOptions(a.length);
	var g = document.getElementById("main_g");
	drawer.clearSvg(g);
	var bars = createBars(a, g);
}
function startSort(type) {
	sortStarted();

	randomArray();
	setOptions(a.length);

	sortType = type;
	var aa = arrayCopy(a);
	console.log(aa);
	if(type === "quickSort"){
		virtualizeQuickSort(aa);
	}else if(type === "bubbleSort"){
		virtualizeBubbleSort(aa);
	}else if(type === "mergeSort"){
		virtualizeMergeSort(aa);
	}

	buttonStatus(sortType);
}
function restartSort() {
	startSort(sortType);
}

function arrayCopy(a) {
	var aa = [];
	for(var i = 0, len = a.length; i < len; i++){
		aa[i] = a[i];
	}
	return aa;
}

function sortStarted() {
	var sortBtns = document.querySelectorAll(".sort-btn");
	for(var i = 0; i < sortBtns.length; i++){
		sortBtns[i].setAttribute("disabled", "true");
	}
}
function sortDone() {
	var sortBtns = document.querySelectorAll(".sort-btn");
	for(var i = 0; i < sortBtns.length; i++){
		sortBtns[i].removeAttribute("disabled");
	}
}
function buttonStatus (sortType) {
	var sortBtns = document.querySelectorAll(".sort-btn");
	for(var i = 0; i < sortBtns.length; i++){
		if(sortBtns[i].getAttribute("class").indexOf(sortType) >= 0){
			sortBtns[i].style.color = "#298cda";
		}else{
			sortBtns[i].style.color = "";
		}
	}
}

function randomArray() {
	var containerW = parseInt( document.getElementById("demoAlg_svg").getAttribute("width") );
	var sort_num = document.getElementById("sort_num").value;
	if(/[^0-9]/.test(sort_num)){
		document.getElementById("sort_num").value = SORT_NUM;
		return;
	}

	sort_num = Number(sort_num);
	if(sort_num === SORT_NUM){
		return;
	}
	createBars.X = createBars.MIN_X;
	console.log(sort_num * 2 * createBars.MIN_W , (containerW - 2 * createBars.X));
	if(sort_num * 2 * createBars.MIN_W > (containerW - 2 * createBars.X)){//TBD River max width 2
		sort_num = Math.floor( (containerW - 2 * createBars.X) / 2 / createBars.MIN_W );
		document.getElementById("sort_num").value = sort_num;
	}
	
	//var 
	a = [];
	var w = Math.floor( (containerW - 2 * createBars.X) / 2 / sort_num );
	if(w < createBars.W){
		createBars.W = w;
		createBars.GAP = createBars.W;
	}
	createBars.X = Math.floor( (containerW - 2 * createBars.W * sort_num) / 2 );
	console.log("sort_num: " + sort_num, w);
	var value;
	for(var i = 0; i < sort_num; i++){
		value = Math.floor( Math.random() * exchanging.DISTANCEY );
		(value === 0) && value++;
		a.push( value );
		//console.log(a);
	}

	SORT_NUM = sort_num;
	//return a;
}

function setOptions(num) {
	var sort_speed = document.getElementById("sort_speed").value;
	if(/[^0-9]/.test(sort_speed)){
		document.getElementById("sort_speed").value = SORT_SPEED;
		return;
	}

	sort_speed = Number(sort_speed);
	if(sort_speed === SORT_SPEED){
		return;
	}
	if(sort_speed < 0){
		sort_speed = 0;
		document.getElementById("sort_speed").value = sort_speed;
	}

	exchanging.GAP_MOVING = sort_speed;
	exchanging.GAP_DONE = exchanging.GAP_RATIO * exchanging.GAP_MOVING;
	
	SORT_SPEED = sort_speed;
}


