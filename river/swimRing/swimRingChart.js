function SwimRingChart(groups, width, height, r1, r2, strokeWidth, activeI, disableActiveStyle){//console.log("SwimRingChart...");
	this.groups = groups;
	this.width = width;
	this.height = height;
	this.cx = this.width / 2;
	this.cy = this.height / 2;
	this.r1 = r1;
	this.r2 = r2;
	this.strokeWidth = strokeWidth;
	this.strokeColor = "#f0f0f0";
	this.disableActiveStyle = disableActiveStyle;

	this.pathes = [];
	this.createChart(width, height, strokeWidth);
	//this.creatBaseRing();
	this.drawChart();

	if(this.r1 > 90){
		this.drawTitle();
	}
	this.setActiveHandler();
}
SwimRingChart.svgns = "http://www.w3.org/2000/svg";
SwimRingChart.textR = 1.3;
SwimRingChart.prototype.createChart = function(){
	var chart = document.createElementNS(SwimRingChart.svgns, "svg:svg");

	chart.setAttribute("width", this.width);
	chart.setAttribute("height", this.height);
	chart.setAttribute("viewBox", "0 0 " + this.width + " " + this.height);

	this.chart = chart;
};
SwimRingChart.prototype.creatPathes = function(){
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
SwimRingChart.prototype.creatBaseRing = function(){
	var path = document.createElementNS(SwimRingChart.svgns, "path");
	path.setAttribute("fill", "#f0f0f0");
	path.setAttribute("stroke", "#f0f0f0"); 
	path.setAttribute("stroke-width", this.strokeWidth);
	path.setAttribute("d", this.getRingTrace());
	this.chart.appendChild(path);
}

SwimRingChart.prototype.getTrace = function(startangle, endangle){
	var x11 = Math.round( ( this.cx + this.r1 * Math.sin(startangle) ) * 100)/100;
	var y11 = Math.round( ( this.cy - this.r1 * Math.cos(startangle) ) * 100)/100;

	var x21 = Math.round( ( this.cx + this.r2 * Math.sin(startangle) ) * 100)/100;
	var y21 = Math.round( ( this.cy - this.r2 * Math.cos(startangle) ) * 100)/100;
	
	var x22 = Math.round( ( this.cx + this.r2 * Math.sin(endangle) ) * 100)/100;
	var y22 = Math.round( ( this.cy - this.r2 * Math.cos(endangle) ) * 100)/100;

	var x12 = Math.round( ( this.cx + this.r1 * Math.sin(endangle) ) * 100)/100;
	var y12 = Math.round( ( this.cy - this.r1 * Math.cos(endangle) ) * 100)/100;

	var big = (endangle - startangle > Math.PI) ? 1 : 0;
	var d = "M " + x11 + " " + y11 + " A " + this.r1 + " " + this.r1 + " 0 " + big + " 1 " + x12 + " " + y12 + " L " + x22 + " " + y22 + " A " + this.r2 + " " + this.r2 + " 0 "+big+" 0 " + x21 + " " + y21 + " Z ";
	return d;
}

SwimRingChart.prototype.drawChart = function(){
	this.creatPathes();

	var groups = this.groups;
	var piece = 10/360*Math.PI*2,
		counts = [],
		total = 0;
	this.angles = [];

	for(var i = 0; i < groups.length; i++) total += groups[i].val;
	for(var i = 0; i < groups.length; i++){
		this.angles[i] = groups[i].val/total*Math.PI*2;
		counts[i] = this.angles[i]/piece;
	}

	var	pathes = this.pathes;
	var startangle = 0,
		endangle;
	var intervals = [];
	this.startangles = [];

	//draw the first piece
	for(var i = 0; i < groups.length;  i++) {
		this.startangles[i] = startangle;
		endangle = counts[i] > 1 ? (startangle + 1 * piece) : this.angles[i];
		pathes[i].setAttribute("d", this.getTrace(startangle, endangle));
		endangle = startangle + this.angles[i];
		startangle = endangle;
	}

	//draw the pieces than 2
	var fines = [],
		self = this;
	for(var i = 0; i < groups.length; i++){
		fines[i] = 1;
		if(counts[i] > 1){
			(function(i){
				var d;
				intervals[i] = setInterval(function(){
					if(fines[i] < counts[i]){
						d = self.getTrace(self.startangles[i], self.startangles[i] + fines[i] * piece);
						pathes[i].setAttribute("d", d);
					}else if(fines[i] >= counts[i]){
						clearInterval(intervals[i]);
						if(Math.round(self.angles[i]/Math.PI/2*360 * 10)/10 != 360){
							d = self.getTrace(self.startangles[i], self.startangles[i] + self.angles[i]);
							pathes[i].setAttribute("d", d);
						}else{
							d = self.getRingTrace();
							pathes[i].setAttribute("d", d);
						}
						
					}
					fines[i] ++;
				}, 16);
			})(i);
		}
	}
}
SwimRingChart.prototype.getRingTrace = function(){
	return "M "+this.cx+" "+(this.cy - this.r1)+" a "+this.r1+" "+this.r1+" 0 0 1 0 "+2*this.r1+" a "+this.r1+" "+this.r1+" 0 1 1 0 -"+2*this.r1+" M "+this.cx+" "+(this.cy-this.r2)+" a "+this.r2+" "+this.r2+" 0 1 0 0 "+2*this.r2+" a "+this.r2+" "+this.r2+" 0 1 0 0 -"+2*this.r2+"  Z";
}
SwimRingChart.prototype.drawTitle = function(){
	this.texts = [];
	for(var i = this.groups.length-1; i >= 0; i--){
		var angleT = this.startangles[i] + this.angles[i]/2;
		var x = this.cx + this.r1*SwimRingChart.textR * Math.sin(angleT);
		var y = this.cy - this.r1*SwimRingChart.textR * Math.cos(angleT);
		this._drawTitle(x, y, i);
	}
}
SwimRingChart.prototype._drawCenterTitle = function(){

}
SwimRingChart.xlink = "http://www.w3.org/1999/xlink";
SwimRingChart.prototype._drawTitle = function(x, y, i){
	var text = document.createElementNS(SwimRingChart.svgns, "text");
	text.setAttribute("i", i);
	text.setAttribute("class", "swimming-text");
	text.setAttribute("stroke-width", "1");
	var tspan = document.createElementNS(SwimRingChart.svgns, "tspan");
	tspan.appendChild(document.createTextNode(this.groups[i].val));
	tspan.setAttribute("x", x);
	tspan.setAttribute("y", y);
	tspan.setAttribute("fill", this.groups[i].color);
	tspan.style.textAnchor = "middle";
	tspan.style.fontSize = "30px";
	text.appendChild(tspan);

	tspan = document.createElementNS(SwimRingChart.svgns, "tspan");
	tspan.appendChild(document.createTextNode(this.groups[i].title));
	tspan.setAttribute("x", x);
	tspan.setAttribute("y", y + 20);
	tspan.style.textAnchor = "middle";
	tspan.style.fontSize = "14px";

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
	this.pathes[i].parentNode.insertBefore(this.pathes[i], this.pathes[i].parentNode.firstChild);//.nextSibling
}
SwimRingChart.prototype.setDefaultStyle = function(){
	this.pathes[this.activeI].setAttribute("stroke", this.strokeColor);
	delete this.activeI;
}


  var width = 800,
      height = 400,
      r1 = 125,
      r2 = 85,
      strokeWidth = 4,
      groups1 = [{ title: "Rice",
                  val: 9,
                  color: "#468847"
                },
                { title: "Corn",
                  val: 5,
                  color: "gray"
                },
                { title: "Bean",
                  val: 12,
                  color: "orange"
                }
              ];
      groups2 = [{ title: "Vegetable",
                  val: 15,
                  color: "orange"
                },
                { title: "Tomato",
                  val: 32,
                  color: "#b94a48"
                },
                { title: "Potato",
                  val: 22,
                  color: "gray"
                },
                { title: "Green Petter",
                  val: 48,
                  color: "#468847"
                }
              ];
      groups3 = [{ title: "Orange",
                  val: 40,
                  color: "#468847"
                },
                { title: "Apple",
                  val: 20,
                  color: "#2b56a4"
                }
              ];


  function demoSwimRing (groups) {
    var swimRing = new SwimRingChart(groups, width, height, r1, r2, strokeWidth);
    swimRing.chart.setAttribute("class", "swimring");
    document.getElementById("swimRingDiv").appendChild(swimRing.chart);
  }

  function redemoSwimRing(value){
    var swimRingDiv = document.getElementById("swimRingDiv");
    swimRingDiv.removeChild(swimRingDiv.firstChild);
    demoSwimRing(window["groups" + value]);
  }




