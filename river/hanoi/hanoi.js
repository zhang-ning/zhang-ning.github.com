function hanoi(A, B, C, n, records){
	outputHanoiStacks(n);
	if(n > 0){
		hanoi(A, C, B, n - 1, records);
		outputHanoiStacks(n)
		var distanceY = (A.data.length() - C.data.length() - 1) * (2 * Tower.DISH_R2 + Tower.DISH_GAP) - (A.y - C.y) ;
		var it = A.pop();
		C.push(it);
		records.push({it: it, distanceX: A.x - C.x, distanceY: distanceY});
		hanoi(B, A, C, n-1, records);
	}else{
		var distanceY = (A.data.length() - C.data.length() - 1) * (2 * Tower.DISH_R2 + Tower.DISH_GAP) - (A.y - C.y);
		var it = A.pop();
		C.push(it);
		records.push({it: it, distanceX: A.x - C.x, distanceY: distanceY});
		outputHanoiStacks(n);
	}
}

function moveDish(records, current, speed) {
	var item = records[current];
	var distanceX = item.distanceX;
	var distanceY = item.distanceY;
	var directionX = distanceX < 0 ? 1 : -1;
	var directionY = distanceY > 0 ? 1 : -1;
	distanceX =  Math.abs(distanceX);
	distanceY =  Math.abs(distanceY);
	var total = Math.ceil( distanceX / exchanging.PIECE );
	var PIECEX = exchanging.PIECE;
	var PIECEY = (distanceY / distanceX) * PIECEX;

	moving(item.it.dish, total, directionX, directionY);

	function moving(it, total, directionX, directionY) {
		var count = 1;
		var intervalRef = setInterval(function(){
			if(count < total){
				move(it, it.pos.x + PIECEX * count * directionX, it.pos.y + PIECEY * count * directionY);
			}else if(count === total){
				it.pos.x = it.pos.x + distanceX * directionX;
				it.pos.y = it.pos.y + distanceY * directionY;
				move(it, it.pos.x, it.pos.y);
			}
			count++;
			if(count > total){
				clearInterval(intervalRef);
				//outputHanoiStacks(n);
				if(++current < records.length){
					moveDish(records, current, speed);
				}else{
					hanoiDone();
				}
			}
		}, speed);
	}

	function move(it, x, y){
		it.elm.setAttribute("d", drawer.linePath(x, y, it.pos.w, 0));
	}
}

function Stack(){
	this.stack = [];
}
Stack.prototype.push = function(it){
	this.stack[this.stack.length] = it;
}
Stack.prototype.pop = function(){
	var lastIndex = this.stack.length - 1;
	var it = this.stack[lastIndex];
	delete this.stack[lastIndex];
	this.stack.length = lastIndex;
	return it;
}
Stack.prototype.length = function() {
	return this.stack.length;
}

function Tower(name, n, x, y, container){
	this.name = name;
	this.x = x;
	this.y = y;
	this.data = new Stack();
	this.dishes = new Stack();

	this.container = (typeof container === "string") ? document.getElementById("container") : container;
	this.initData(n);
	this.initDishes(n);
	this.title();
}
Tower.DISH_R1 = 30;
Tower.DISH_R2 = Tower.DISH_R1 / 15;
Tower.DISH_GAP = Tower.DISH_R2 ;/// 3 * 2

Tower.prototype.initData = function(n) {
	for(var i = 0; i < n; i++){
		this.data.push(n-i);
	}
}
Tower.prototype.initDishes = function(n){
	var R1_GAP = Tower.DISH_R1 / n;
	var dish;
	for(var i = 0; i < n; i++){
		dish = new Dish(this.x, this.y - i * (2 * Tower.DISH_R2 + Tower.DISH_GAP), Math.floor( R1_GAP * (n - i) * 2)/2, Tower.DISH_R2 );
		this.dishes.push(dish);
		this.container.appendChild(dish.elm);
	}
}
Tower.prototype.title = function() {
	var line = drawer.pathLine(this.x - 1.5 * Tower.DISH_R1, this.y + 2 * Tower.DISH_R2 + 1, Tower.DISH_R1 * 3, 0);
	line.setAttribute("stroke-linecap", "round");
	line.setAttribute("stroke", "gray");
	line.setAttribute("stroke-width", Tower.DISH_R2);
	this.container.appendChild(line);
}
Tower.prototype.push = function(it) {
	this.data.push(it.value);
	this.dishes.push(it.dish);
}
Tower.prototype.pop = function(){
	return {
		value: this.data.pop(),
		dish: this.dishes.pop()
	};
}

function Dish(x, y, r1, r2){
	var pos = { x: x - r1, 
			y: y + r2, 
			w: 2 * r1, 
			h: 2 * r2 };
	//this.elm = drawer.drawBar(pos.x, pos.y, pos.w, pos.h);
	this.elm = drawer.pathLine(pos.x, pos.y, pos.w, 0);
	this.elm.setAttribute("stroke-width", pos.h);
	this.elm.setAttribute("stroke-linecap", "round");
	this.pos = pos;
}

var A, B, C;
function demoHanoi(){
	//console.log(A, B, C);
	checkOptions();
	hanoiStarted();

	var container = document.getElementById("demoHanoi_svg");
	drawer.clearSvg(container);
	var towerRadius = Math.floor( parseInt( container.getAttribute("width") ) / 3 / 2);
	var towerBaseline = Math.floor( parseInt( container.getAttribute("height") ) / 3 * 2 );
	var num = parseInt(document.getElementById("hanoi_num").value);
	var speed = parseInt(document.getElementById("hanoi_speed").value);
	//var 
	A = new Tower("A", num, towerRadius, towerBaseline, container );
	//var 
	B = new Tower("B", 0, 3 * towerRadius, towerBaseline - 60, container );
	//var 
	C = new Tower("C", 0, 5 * towerRadius, towerBaseline, container );
	var records = [];

	setTimeout(function() {
		hanoi(A, B, C, A.data.stack.length - 1, records);
		document.getElementById("hanoi_steps").textContent = records.length;
		moveDish(records, 0, speed);
	}, 0);
};
function outputHanoiStacks(n){
	//console.log(A.data.stack, B.data.stack, C.data.stack, n);
};
function checkOptions() {
	var hanoi_speed = document.getElementById("hanoi_speed");
	var hanoi_num = document.getElementById("hanoi_num");

	if(/[^0-9]/.test(hanoi_speed.value)){
		hanoi_speed.value = 8;
	}
	if(Number(hanoi_speed.value) < 0){
		hanoi_speed.value = 0;
	}

	if(/[^0-9]/.test(hanoi_num.value)){
		hanoi_num.value = 3;
	}
	hanoi_num = Number(hanoi_num.value);
	if( hanoi_num < 0){
		hanoi_num.value = 0;
	}
	var steps_desc = document.getElementById("steps_desc");
	if(hanoi_num > 20){
		steps_desc.style.border = "2px solid red";
	}else{
		steps_desc.style.border = "";
	}
}

function hanoiStarted() {
	var btn = document.getElementById("hanoi-btn");
	btn.setAttribute("disabled", "true");
	btn.style.color = "#298cda";
	btn.textContent = "Moving...";
}
function hanoiDone() {
	var btn = document.getElementById("hanoi-btn");
	btn.removeAttribute("disabled");
	btn.style.color = "";
	btn.textContent = "Start";
}

