function Painter(canvas){
	this.x1 = null;
	this.y1 = null;
	this.traces = [];
	this.trace = [];
	this.durings = [];
	this.during = {};
	if(typeof canvas === "string"){
		canvas = document.getElementById(canvas);
	}
	this.canvas = canvas;
	this.container = this.canvas.parentNode;
	
	var rect = this.canvas.getBoundingClientRect();
	this.diffTop = document.body.scrollTop + Math.round(rect.top);
	this.diffLeft = document.body.scrollLeft +  Math.round(rect.left);
}
Painter.startEvent = ('ontouchstart' in window ? 'touchstart' : 'mousedown');
Painter.endEvent = ('ontouchend' in window ? 'touchend' : 'mouseup');
Painter.moveEvent = ('ontouchmove' in window ? 'touchmove' : 'mousemove');

Painter.prototype.init = function(e){
	var self = this;
	this.startDrawLineReference= function(e){
		e.preventDefault();
		//e.stopPropagation();
		var ee = e;
		if(e.touches){
			ee = e.touches[0];
		}
		self.startDrawLine(ee);
	}
	
	this.container.addEventListener(Painter.startEvent, this.startDrawLineReference, false);
}

Painter.prototype.destroy = function(){
	this.container.removeEventListener(Painter.startEvent, this.startDrawLineReference, false);
}

Painter.prototype.startDrawLine = function(e){
	//console.log("mousedown...");
	//console.log(e.pageX);
	//console.log(e.pageY);
	this.x1 = e.pageX - this.diffLeft; 
	this.y1 = e.pageY - this.diffTop;
	this.trace = [];
	this.trace.push({x: this.x1, y: this.y1});
	this.during = {start: (new Date()).getTime()};
	var g = this.canvas.getContext("2d");
    g.lineWidth = 1;
    g.strokeStyle = "black";
    this.g = g;

	var self = this;
	this.drawLineAtMovingReference = function(e){
		var ee = e;
		if(e.touches){
			ee = e.touches[0];
		}
		self.drawLineAtMoving(ee);
	}
	this.stopDrawLineReference = function(e){
		var ee = e;
		if(e.touches){
			ee = e.touches[0];
		}
		self.stopDrawLine(ee);
	}
	this.container.addEventListener(Painter.moveEvent, this.drawLineAtMovingReference, false);
	this.container.addEventListener(Painter.endEvent, this.stopDrawLineReference, false);
}

Painter.prototype.drawLineAtMoving = function(e){
	//console.log("mousemove...");
	var x2 = e.pageX - this.diffLeft;
	var y2 = e.pageY - this.diffTop;
	if(x2 && y2 && this.x1 && this.y1){
		this.drawLine(this.x1, this.y1, x2, y2);
		this.x1 = x2; 
		this.y1 = y2;
		this.trace.push({x: x2, y: y2});
	}
}

Painter.prototype.stopDrawLine = function(e){
	//console.log("mouseup...");
	var x = e.pageX - this.diffLeft;
	var y = e.pageY - this.diffTop;
	if(this.trace){
		this.traces.push(this.trace);
		this.during.end = (new Date()).getTime();
		this.durings.push(this.during);
	}

	if(this.drawLineAtMovingReference){
		this.container.removeEventListener(Painter.moveEvent, this.drawLineAtMovingReference, false);
		delete this.drawLineAtMovingReference;
	}
	if(this.stopDrawLineReference){
		this.container.removeEventListener(Painter.endEvent, this.stopDrawLineReference, false);
		delete this.stopDrawLineReference;
	}
	this.g = null;
}


Painter.prototype.drawLine = function(x1, y1, x2, y2){
	//console.log(x1 + " "+ y1);console.log(x2 + " "+ y2);
	/*x1 = x1 - this.diffLeft;
	y1 = y1 - this.diffTop;
	x2 = x2 - this.diffLeft;
	y2 = y2 - this.diffTop;*/

	var g = this.g;

    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke( ); 
    g.closePath();
}

Painter.prototype.replay = function(traces, durings){
	this.clear();
	this.g = this.canvas.getContext("2d");
	var self = this;
	var current = 0;
	var myCount = 0;
	var trace = traces[current];//self.
	//var intervalRef = 
	startDrawingInterval();
	var total = traces.length - 1;//self.

	function startDrawingInterval(){
		var options = self._getOptions(trace, durings[current]);//self.
		//return 
		var intervalRef = setInterval(function(){
			if(myCount < options.count - 1){
				self.drawLine(trace[myCount].x, trace[myCount].y, trace[myCount + 1].x, trace[myCount + 1].y);
				myCount++;
			}else {//if(myCount >= options.count - 1)
				clearInterval(intervalRef);
				if(current < total){
					myCount = 0;
					current++;
					trace = traces[current];//self.
					//intervalRef = 
					startDrawingInterval();
				}else{
					this.g = null;
				}
			}
		}, options.gap);
	}
}

Painter.prototype._getOptions = function(trace, during){
	var len = trace.length;
	var gap = Math.round( (during.end - during.start) / ((len - 1) || 1) );
	return { gap: gap,	count: len - 1 };
}

Painter.prototype.playDefaults = function() {
	//this.traces = default_traces;
	//this.durings = default_durings;
	this.replay(default_traces, default_durings);
}

Painter.prototype.reset = function(){
	this.clear();
	this.traces = [];
	this.trace = [];
	this.durings = [];
	this.during = [];
}

Painter.prototype.clear = function(){
	this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
}

function demoPainter(){
	window.painter = new Painter("painterCanvas");
	painter.init();
	painter.playDefaults();
}
