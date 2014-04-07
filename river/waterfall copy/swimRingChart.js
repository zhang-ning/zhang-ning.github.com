function SwimRingChart(groups, options){
	this.groups = groups;
	this.r1 = options.r1;
	this.r2 = options.r2;
	this.strokeWidth = options.strokeWidth || 0;
	this.strokeColor = "#f0f0f0";
	this.disableActiveStyle = options.disableActiveStyle;
	this.titleSize = options.titleSize || SwimRingChart.titleSize;
	this.startangle = options.startangle || SwimRingChart.startangle;
	this.texts = [];

	!groups[0].angle && this.initAngle();
	this.initData();
	if(options.g){
		this.chart = options.g;
	}else{
		this.createChart(options.width, options.height);
	}

	if(options.cx){
		this.cx = options.cx;
	}else{
		if(options.width){
			this.cx = options.width / 2;
		}else if(options.g){
			var gStyle = Utils.getStyle(options.g);
			var width = gStyle.getPropertyValue("width");
			if(width){
				this.cx = Utils.getPxNum( width ) / 2;
			}
		}
	}
	
	if(options.cy){
		this.cy = options.cy;
	}else{
		if(options.height){
			this.cx = options.height / 2;
		}else if(options.g){
			if(!gStyle){
				gStyle = Utils.getStyle(options.g);
			}
			var height = gStyle.getPropertyValue("height");
			if(height){
				this.cy = Utils.getPxNum( height ) / 2;
			}
		}
	}
	/*if(!options.width || !options.height){
		var gStyle = Utils.getStyle(options.g);
		var width = gStyle.getPropertyValue("width");
		var height = gStyle.getPropertyValue("height");

		if(height){
			this.cy = Utils.getPxNum( height ) / 2;
		}
	}else{
		this.cx = options.width / 2;
		this.cy = options.height / 2;
	}*/

	this.creatPathes();
	this.drawPathes();
	!options.withoutTitle && this.drawTitle();
	!options.disableActiveHandler && this.setActiveHandler();
}

SwimRingChart.piece = 10/360*Math.PI*2;
SwimRingChart.startangle = 0/360*Math.PI*2;
SwimRingChart.textR = 1.3;
SwimRingChart.titleSize = 12;
SwimRingChart.svgns = "http://www.w3.org/2000/svg";
SwimRingChart.xlink = "http://www.w3.org/1999/xlink";

SwimRingChart.prototype.initAngle = function () {
	var total = 0;
	for(var i = 0, len = this.groups.length; i < len; i++){
		total += Number(this.groups[i].value);
	}

	for(var i = 0, len = this.groups.length; i < len; i++){
		this.groups[i].angle = (this.groups[i].value / total ) * Math.PI * 2;
	}
}

SwimRingChart.prototype.initData = function(){
	this.startangles = [];
	this.counts = [];
	this.points = [];
	var startangle = this.startangle;
	for(var i = 0, len = this.groups.length; i < len; i++){
		this.counts[i] = this.groups[i].angle/SwimRingChart.piece;
		this.startangles[i] = startangle;
		this.points.push(this.getXY(this.startangles[i], this.startangles[i] + this.groups[i].angle));
		startangle = startangle + this.groups[i].angle;
	}
}

SwimRingChart.prototype.createChart = function(width, height){
	var chart = document.createElementNS(SwimRingChart.svgns, "svg:svg");
	chart.setAttribute("width", width);
	chart.setAttribute("height", height);
	chart.setAttribute("viewBox", "0 0 " + width + " " + height);
	chart.setAttribute("class", "swimring");
	return chart;
};

SwimRingChart.prototype.creatPathes = function(){
	this.pathes = [];
	for(var i = 0; i < this.groups.length;  i++) {
		var path = document.createElementNS(SwimRingChart.svgns, "path");
		path.setAttribute("i", i);
		path.setAttribute("fill", this.groups[i].color);
		path.setAttribute("stroke", "#f0f0f0"); 
		path.setAttribute("stroke-width", this.strokeWidth);
		path.setAttribute("class", "swimming-arc");
		this.chart.appendChild(path);
		this.pathes.push(path);
	}
}

SwimRingChart.prototype.getXY = function(startangle, endangle){
	var x11 = Math.round( ( this.cx + this.r1 * Math.sin(startangle) ) * 100)/100;
	var y11 = Math.round( ( this.cy - this.r1 * Math.cos(startangle) ) * 100)/100;

	var x21 = Math.round( ( this.cx + this.r2 * Math.sin(startangle) ) * 100)/100;
	var y21 = Math.round( ( this.cy - this.r2 * Math.cos(startangle) ) * 100)/100;
	
	var x22 = Math.round( ( this.cx + this.r2 * Math.sin(endangle) ) * 100)/100;
	var y22 = Math.round( ( this.cy - this.r2 * Math.cos(endangle) ) * 100)/100;

	var x12 = Math.round( ( this.cx + this.r1 * Math.sin(endangle) ) * 100)/100;
	var y12 = Math.round( ( this.cy - this.r1 * Math.cos(endangle) ) * 100)/100;

	return { outStart: { x: x11, y: y11 },
			 innerStart: { x: x21, y: y21 },
			 outEnd: { x: x12, y: y12 },
			 innerEnd: { x: x22, y: y22  }
		   };
}

SwimRingChart.prototype.getTrace = function(startangle, endangle){
	var pos = this.getXY(startangle, endangle);
	var big = (endangle - startangle > Math.PI) ? 1 : 0;
	var d = "M " + pos.outStart.x + " " + pos.outStart.y + " A " + this.r1 + " " + this.r1 + " 0 " + big + " 1 " + pos.outEnd.x + " " + pos.outEnd.y + " L " + pos.innerEnd.x + " " + pos.innerEnd.y + " A " + this.r2 + " " + this.r2 + " 0 "+big+" 0 " + pos.innerStart.x + " " + pos.innerStart.y + " Z ";
	return d;
}

SwimRingChart.prototype.drawPathes = function(){
	//draw the first piece
	var endangle;
	for(var i = 0; i < this.groups.length;  i++) {
		endangle = this.counts[i] > 1 ? (this.startangles[i] + 1 * SwimRingChart.piece) : this.groups[i].angle;
		this.pathes[i].setAttribute("d", this.getTrace(this.startangles[i], endangle));
	}

	//draw the pieces than 2
	var intervals = [];
	var fines = [];
	var self = this;
	for(var i = 0; i < this.groups.length; i++){
		fines[i] = 1;
		if(this.counts[i] > 1){
			(function(i){
				var d;
				intervals[i] = setInterval(function(){
					if(fines[i] < self.counts[i]){
						d = self.getTrace(self.startangles[i], self.startangles[i] + fines[i] * SwimRingChart.piece);
						self.pathes[i].setAttribute("d", d);
					}else if(fines[i] >= self.counts[i]){
						clearInterval(intervals[i]);
						if(Math.round(self.groups[i].angle/Math.PI/2*360 * 10)/10 != 360){
							d = self.getTrace(self.startangles[i], self.startangles[i] + self.groups[i].angle);
							self.pathes[i].setAttribute("d", d);
						}else{
							d = "M "+self.cx+" "+(self.cy - self.r1)+" a "+self.r1+" "+self.r1+" 0 0 1 0 "+2*self.r1+" a "+self.r1+" "+self.r1+" 0 1 1 0 -"+2*self.r1+" M "+self.cx+" "+(self.cy-self.r2)+" a "+self.r2+" "+self.r2+" 0 1 0 0 "+2*self.r2+" a "+self.r2+" "+self.r2+" 0 1 0 0 -"+2*self.r2+"  Z";
							self.pathes[i].setAttribute("d", d);
						}
					}
					fines[i] ++;
				}, 16);
			})(i);
		}
	}
}

SwimRingChart.prototype.drawTitle = function(){
	for(var i = this.groups.length-1; i >= 0; i--){
		if(this.groups[i].title){
			var angleT = this.startangles[i] + this.groups[i].angle/2;
			var x = this.cx + this.r1*SwimRingChart.textR * Math.sin(angleT);
			var y = this.cy - this.r1*SwimRingChart.textR * Math.cos(angleT);
			this._drawTitle(x, y, this.groups[i].title, this.groups[i].color, "middle", i);
		}
	}
}

SwimRingChart.prototype._drawTitle = function(x, y, title, color, textAnchor, i){
	var text = document.createElementNS(SwimRingChart.svgns, "text");
	text.setAttribute("i", i);
	text.setAttribute("class", "swimming-text");
	text.setAttribute("stroke-width", "1");
	/*var tspan = document.createElementNS(SwimRingChart.svgns, "tspan");
	tspan.appendChild(document.createTextNode(this.groups[i].val));
	tspan.setAttribute("x", x);
	tspan.setAttribute("y", y);
	tspan.setAttribute("fill", this.groups[i].color);
	tspan.style.textAnchor = "middle";
	tspan.style.fontSize = this.titleSize;
	text.appendChild(tspan);*/

	var tspan = document.createElementNS(SwimRingChart.svgns, "tspan");
	tspan.appendChild(document.createTextNode(title));
	tspan.setAttribute("x", x);
	tspan.setAttribute("y", y);
	tspan.setAttribute("fill", color);
	tspan.style.textAnchor = textAnchor;//"middle";
	tspan.style.fontSize = this.titleSize;

	text.appendChild(tspan);
	this.chart.appendChild(text);

	this.texts.push(text);
}

SwimRingChart.prototype.setActiveHandler = function(){
	var self = this;
	for(var j = this.groups.length - 1; j >= 0; j--){
		Utils.bindEvent(this.pathes[j], "click", function(e){
			self.activeHandler(e);
		});
		if(this.r1 > 90){
		Utils.bindEvent(this.texts[j], "click", function(e){
			self.activeHandler(e);
		});}
	}
}

SwimRingChart.prototype.activeHandler = function(e){
	var target = e.currentTarget;
	var i = target.getAttribute("i");

	(!this.disableActiveStyle) && this.setActiveStyle(i);
	this.groups[i].linking && ( window.location.hash = this.groups[i].linking );
}

SwimRingChart.prototype.setActiveStyle = function(i){
	(this.activeI !== undefined) && this.pathes[this.activeI].setAttribute("stroke", this.strokeColor);
	this.activeI = i;
	this.pathes[i].setAttribute("stroke", this.pathes[i].getAttribute("fill"));
	this.pathes[i].parentNode.insertBefore(this.pathes[i], this.pathes[i].parentNode.firstChild);
}

SwimRingChart.prototype.setDefaultStyle = function(){
	this.pathes[this.activeI].setAttribute("stroke", this.strokeColor);
	delete this.activeI;
}


  var groups1 = [{ title: "Rice",
                  angle: 0.45*Math.PI*2,
                  color: "#468847"
                },
                { title: "Corn",
                  angle: 0.25*Math.PI*2,
                  color: "gray"
                },
                { title: "Bean",
                  angle: 0.3*Math.PI*2,
                  color: "orange"
                }
              ];
      groups2 = [{ title: "Vegetable",
                  angle: 0.15*Math.PI*2,
                  color: "orange"
                },
                { title: "Tomato",
                  angle: 0.35*Math.PI*2,
                  color: "#b94a48"
                },
                { title: "Potato",
                  angle: 0.05*Math.PI*2,
                  color: "gray"
                },
                { title: "Green Petter",
                  angle: 0.45*Math.PI*2,
                  color: "#468847"
                }
              ];
      groups3 = [{ title: "Orange",
                  angle: 0.75*Math.PI*2,
                  color: "#468847"
                },
                { title: "Apple",
                  angle: 0.25*Math.PI*2,
                  color: "#2b56a4"
                }
              ];

  var options = {name: "river"};
  function setSwimRingOptions(){
    var swimRing_svg = document.getElementById("swimRing_svg"),
    swimRing_width = boardWidth,
    swimRing_height = parseInt(swimRing_svg.getAttribute("height")),
    swimRing_r1 = Math.floor( (swimRing_height < swimRing_width) ? swimRing_height / 3 : swimRing_width / 3 );
    swimRing_r2 = Math.ceil(swimRing_r1 / 3 * 2);

    //var 
    options = { width: swimRing_width,
					height: swimRing_height,
					strokeWidth: 4,
					titleSize: 16,
					r1: swimRing_r1,
					r2: swimRing_r2,
					g: swimRing_svg};
  }

  function demoSwimRing () {
    setSwimRingOptions();
    new SwimRingChart(groups1, options);
  }

  function redemoSwimRing(value){
    drawer.clearSvg(document.getElementById("swimRing_svg"));
    new SwimRingChart(window["groups" + value], options);
  }
