function Liner(canvas, mode){
	this.x1 = null;
	this.y1 = null;
	this.points1 = null;
	this.points2 = null;
	this.hold1 = (mode == 2 || mode == 3) ? 1 : 0;//1
	this.hold2 = (mode == 1 || mode == 3) ? 1 : 0;//n
	this.matchPairs = {};
	this.helpPairs = {};

	if(typeof canvas === "string"){
		canvas = document.getElementById(canvas);
	}
	this.canvas = canvas;
	this.container = this.canvas.parentNode;
	var rect = this.canvas.getBoundingClientRect();
	this.diffTop = Math.round(rect.top);
	this.diffLeft = Math.round(rect.left);
	this.testIn = document.getElementById("test-in");
}
Liner.gapV = 30;
Liner.markMargin = 15;
Liner.markRadiu = 3;

Liner.startEvent = ('ontouchstart' in window ? 'touchstart' : 'mousedown');
Liner.endEvent = ('ontouchend' in window ? 'touchend' : 'mouseup');
Liner.moveEvent = ('ontouchmove' in window ? 'touchmove' : 'mousemove');

Liner.prototype.switchMode = function(mode){
	this.matchPairs = {};
	this.helpPairs = {};
	this.hold1 = (mode == 2 || mode == 3) ? 1 : 0;//1
	this.hold2 = (mode == 1 || mode == 3) ? 1 : 0;//n
	this.g = this.canvas.getContext("2d");
	this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.fillHotArea();
	this.drawList();
}

Liner.prototype.init = function(e){
	this.g = this.canvas.getContext("2d");
    this.g.lineWidth = 1;
    this.g.strokeStyle = "black";

	this.initData();
	this.computeHotArea();
	this.fillHotArea();
	this.computePoints();
	this.drawList();
	var self = this;
	this.startDrawLineReference= function(e){
		e.preventDefault();
		//e.stopPropagation();
		self.startDrawLine(e);
	}
	this.container.addEventListener(Liner.startEvent, this.startDrawLineReference, false);
}

Liner.prototype.destroy = function(){
	this.container.removeEventListener(Liner.startEvent, this.startDrawLineReference, false);
}

Liner.prototype.startDrawLine = function(e){
	//console.log("mousedown...");
	this.testIn.value = e.pageX + " " + e.pageY + " ";// + areaId;
	var startFrom = this.inHotArea(e.pageX, e.pageY);
	if(startFrom){
		this.startFrom = startFrom;
		if(startFrom == 1){
			this.startItemId = this.closestTo(e.pageX - this.diffLeft, e.pageY - this.diffTop, this.listLen1, this.startTop, this.startHeight);
		}else{
			this.startItemId = this.closestTo(e.pageX - this.diffLeft, e.pageY - this.diffTop, this.listLen2, this.endTop, this.endHeight);
		}
	}else{
		this.startFrom = null;
		this.startItemId = null;
		return;
	}

	this.x1 = e.pageX;
	this.y1 = e.pageY;
	this.g = this.canvas.getContext("2d");
	var g = this.g;
    g.lineWidth = 1;
    g.strokeStyle = "black";


	var self = this;
	this.drawLineAtMovingReference = function(e){
		self.drawLineAtMoving(e);
	}
	this.stopDrawLineReference = function(e){
		self.stopDrawLine(e);
	}

	this.container.addEventListener(Liner.moveEvent, this.drawLineAtMovingReference, false);
	window.addEventListener(Liner.endEvent, this.stopDrawLineReference, false);
}

Liner.prototype.drawLineAtMoving = function(e){
	//console.log("mousemove...");
	var x2 = e.pageX;
	var y2 = e.pageY;
	if(x2 && y2 && this.x1 && this.y1){
		this.drawLine(this.x1, this.y1, x2, y2, this.canvas);
		this.x1 = x2; 
		this.y1 = y2;
	}
}

Liner.prototype.stopDrawLine = function(e){
	//console.log("mouseup...");
	this.stop = true;
	var x = e.pageX || this.x1;
	var y = e.pageY || this.y1;
	var endTo = this.inHotArea(e.pageX, e.pageY);
	var endTo = this.inHotArea(this.x1, this.y1);
	this.testIn.value = e.pageX + " " + e.pageY + " " + this.x1 + " " + this.y1 + " " +  endTo;// + areaId;
	if(endTo && this.startFrom && (this.startFrom + endTo) === 3){
		var endItemId = null;
		if(endTo == 2){
			endItemId= this.closestTo(x - this.diffLeft, y - this.diffTop, this.listLen2, this.endTop, this.endHeight);
			this.pushPair(this.startItemId, endItemId);
		}else{
			endItemId = this.closestTo(x - this.diffLeft, y - this.diffTop, this.listLen1, this.startTop, this.startHeight);
			this.pushPair(endItemId, this.startItemId);
		}
		//this.drawLine(this.originalX1, this.originalY1, e.pageX, e.pageY, this.canvas);
	}else{
		this.startFrom = null;
	}

	if(this.drawLineAtMovingReference){
		this.container.removeEventListener(Liner.moveEvent, this.drawLineAtMovingReference, false);
		delete this.drawLineAtMovingReference;
	}
	if(this.stopDrawLineReference){
		window.removeEventListener(Liner.endEvent, this.stopDrawLineReference, false);
		delete this.stopDrawLineReference;
	}

	this.reproduceImage();
	this.g = null;
}

Liner.prototype.pushPair = function(startItemId, endItemId){
	if(this.hold1 === 0 && this.hold2 === 0){
		delete this.matchPairs[this.helpPairs[endItemId]];
		delete this.helpPairs[this.matchPairs[startItemId]];
		this.matchPairs[startItemId] = [endItemId];
		this.helpPairs[endItemId] = startItemId;
	}else if(this.hold1 === 0){
		this.matchPairs[startItemId] = [endItemId];
	}else if(this.hold2 === 0){
		this.matchPairs[endItemId] = [startItemId];
	}else{
		if(this.matchPairs[startItemId]){
			this.matchPairs[startItemId].push(endItemId)
		}else{
			this.matchPairs[startItemId] = [endItemId];
		}

	}
}

Liner.prototype.drawLine = function(x1, y1, x2, y2, canvas){
	x1 = x1 - this.diffLeft;
	y1 = y1 - this.diffTop;
	x2 = x2 - this.diffLeft;
	y2 = y2 - this.diffTop;

	var g = this.g;//canvas.getContext("2d");

    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke( ); 
    g.closePath();
}

Liner.prototype.reproduceImage = function(){
	//console.log("reproduceImage...");
	this.g = this.canvas.getContext("2d");
	this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.fillHotArea();
	this.drawList();

	this.produceImage(this.matchPairs);
}

Liner.prototype.produceImage = function(matchPairs){
	//var matchPairs = this.matchPairs;
	var startPoints, endPoints;
	var diff1 = 1/2*this.startWidth - Liner.markMargin + Liner.markRadiu;
	var diff2 = -1*1/2*this.endWidth + Liner.markMargin - Liner.markRadiu;
	if(this.hold2 === 0 && this.hold1>0){
		startPoints = this.points2;
		endPoints = this.points1
		diff1 = -1 * diff1;
		diff2 = -1 * diff2;
	}else{
		startPoints = this.points1;
		endPoints = this.points2;
	}
	for(var i in matchPairs){
		var startPoint = startPoints[i];
		var destinations = matchPairs[i];
		for(var j = 0; j<destinations.length; j++){
			var endPoint = endPoints[destinations[j]];
			var x1 = startPoint.x + diff1;
			var x2 = endPoint.x + diff2;
			this.drawLine(x1, startPoint.y, x2, endPoint.y, this.canvas);
		}
	}
}

Liner.prototype.computePoints = function(){
	//console.log("computePoints ");
	var points = [];
	var pointX = this.diffLeft + this.startLeft + this.startWidth / 2 ;//TBD 10
	for(var i=0; i<this.list1.length; i++){
		var pointY = Math.round(this.diffTop + this.startTop + i*Liner.gapV + Liner.gapV / 2);// + marginDifference;//TBD 6
		points.push({x: pointX, y: pointY});
	}
	this.points1 = points;

	points = [];
	var pointX = this.diffLeft + this.endLeft + this.endWidth / 2 ;//TBD 10
	for(var i=0; i<this.list2.length; i++){
		var pointY = Math.round(this.diffTop + this.endTop + i*Liner.gapV + Liner.gapV / 2);// + marginDifference;//TBD 6
		points.push({x: pointX, y: pointY});
	}
	this.points2 = points;
}
Liner.prototype.drawList = function(){
	for(var i = 0, len = this.points1.length; i < len; i++){
		this.drawCircle(this.points1[i].x - this.diffLeft + 1/2*this.startWidth - Liner.markMargin, this.points1[i].y - this.diffTop, Liner.markRadiu, 0, 2*Math.PI);
		this.drawText(this.list1[i].name, this.points1[i].x - this.diffLeft, this.points1[i].y - this.diffTop);
	}
	for(var i = 0, len = this.points2.length; i < len; i++){
		this.drawCircle(this.points2[i].x - this.diffLeft - 1/2*this.endWidth + Liner.markMargin, this.points2[i].y - this.diffTop, Liner.markRadiu, 0, 2*Math.PI);
		this.drawText(this.list2[i].name, this.points2[i].x - this.diffLeft, this.points2[i].y - this.diffTop);
	}
}
Liner.prototype.drawCircle = function(x, y, radius, startAngle, endAngle, counterclockwise){
	var ctx = this.canvas.getContext("2d");
    ctx.beginPath( );              // Start a new shape
    //ctx.moveTo(x, y);            // Move to center
	ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
	ctx.fillStyle = "white";
	ctx.fill();
	//ctx.lineWidth = 1;
	//ctx.strokeStyle = "green";
	ctx.stroke();
	ctx.closePath();
}
Liner.prototype.drawText = function(text, x, y){
	var ctx = this.canvas.getContext("2d");
	ctx.font="12px Georgia";
	ctx.textBaseline="middle"; 
	ctx.textAlign="center"; 
	ctx.fillStyle = "black";
	ctx.fillText(text,x,y);
}
Liner.prototype.closestTo = function(x, y, len, offsetTop, listHeight){
	var itemHeight= listHeight / len;
	var distanceY = y - offsetTop;
	var index = distanceY / itemHeight;

	if(index>=0 && index <=len){
		if(index >0 && (""+index).indexOf(".")<0 ){
		   index = Math.floor(index) -1;
		}else{
		   index = Math.floor(index)
		}
	}else{
	   //console.log("not in the hot area");
	}
	return index;
}

Liner.prototype.inHotArea = function(x, y){
	x = x - this.diffLeft;
	y = y - this.diffTop;
	var areaId = 0;
	if( x >= (this.startLeft) && x <= (this.startLeft + this.startWidth) && 
		y >= (this.startTop) && y <= (this.startTop + this.startHeight)){
		areaId = 1;
	}else if( x >= (this.endLeft) && x <= (this.endLeft + this.endWidth) && 
		y >= (this.endTop) && y <= (this.endTop + this.endHeight)){
		areaId = 2;
	}

	return areaId;
}

Liner.prototype.computeHotArea = function(){
	var width = this.canvas.width;
	var height = this.canvas.height;
	this.lineLength = width / 4;
	this.startWidth = this.lineLength / 2;
	this.endWidth = this.startWidth;

	this.startLeft = (width - this.lineLength - this.startWidth - this.endWidth) / 2;
	this.startHeight = Liner.gapV * this.list1.length;
	this.startTop = (height - this.startHeight) / 2;

	this.endLeft = width - this.startLeft - this.endWidth;
	this.endHeight = Liner.gapV * this.list2.length;
	this.endTop = (height - this.endHeight) / 2;
}

Liner.prototype.fillHotArea = function(){
	var ctx = this.g;
	ctx.rect(this.startLeft, this.startTop, this.startWidth, this.startHeight);
	ctx.fillStyle = "yellow";// white
	ctx.rect(this.endLeft, this.endTop, this.endWidth, this.endHeight);
	ctx.fill();
}

Liner.prototype.initData = function(list1, list2){
	var list1 = [	{id: 1, name: "A 1"}, 
				{id: 2, name: "A 2"}, 
				{id: 3, name: "A 3"}, 
				{id: 4, name: "A 4"}
			];

	var list2 = [	{id: 11, name: "B 1"}, 
				{id: 22, name: "B 2"}, 
				{id: 33, name: "B 3"}, 
				{id: 44, name: "B 4"}
			];
	this.list1 = list1;
	this.list2 = list2;
	this.listLen1 = list1.length;
	this.listLen2 = list2.length;
}
Liner.DEMO_MATCHPAIRS = {"0":[2]};
function demoLiner(){
	var mode = document.getElementById("chooseMode").value;
	window.liner = new Liner("linerCanvas", mode);
	liner.init();
	liner.produceImage(Liner.DEMO_MATCHPAIRS);
}