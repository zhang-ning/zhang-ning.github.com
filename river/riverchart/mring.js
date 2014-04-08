function MRing(groups, options){
	this.g = options.g;
	this.r1 = options.r1;
	this.r2 = options.r2;
	this.options = options;
	this.groups = groups;

	this.data = this.cookData(this.groups);
	this.rings = this.mrings(this.groups, this.data);
	this.wring = this.wrapRing(this.data);//TBD
}

MRing.SPEED = 16;
MRing.PIECE_ANGLE = 10/360*Math.PI*2;
MRing.PIECE_DISTANCE = 2;

MRing.prototype.cookData = function(groups){
	var totals = [];
	var amount = 0;
	for(var i = 0, len1 = groups.length; i < len1; i++){
		var total = 0;
		var sheets = groups[i].groups;
		for(var j = 0, len2 = sheets.length; j < len2; j++){
			total += sheets[j].value;
		}
		totals.push(total);
		amount += total;
	}

	
	var angles = [];
	var startangles = [];
	var wingRadius = [];
	var wrapGroups = [];//TBD

	var startangle = this.options.startangle || 0;
	for(var i = 0; i < len1; i++){
		angles[i] = ( totals[i] / amount ) * Math.PI * 2;
		wrapGroups.push({ angle: angles[i], color: "transparent" });//TBD
		var subWingRadius = [];
		var previousR1 = this.r2;
		for(var j = 0, len2 = groups[i].groups.length; j < len2; j++){
			var r1 = (groups[i].groups[j].value / totals[i]) * (this.r1 - this.r2) + previousR1;
			subWingRadius.push({r1: r1, r2: previousR1});
			previousR1 = r1;
		}
		wingRadius.push(subWingRadius);
		startangles.push( startangle );
		startangle += angles[i];
	}

	var data = {
		wrapGroups: wrapGroups,//TBD
		angles: angles,
		startangles: startangles,
		wingRadius: wingRadius
	};
	return data;
}

MRing.prototype.mrings = function(groups, data ){
	var rings = [];
	for(var i = 0, len1 = groups.length; i < len1; i++){
		var sheets = groups[i].groups;
		var subRings = [];
		for(var j = 0, len2 = sheets.length; j < len2; j++){
			var subWingRadiu = data.wingRadius[i][j];
			var ringGroups = [ { angle: data.angles[i], color: sheets[j].color} ];
			var ringOpions = { r1: subWingRadiu.r1, r2: subWingRadiu.r2, startangle: data.startangles[i], g: this.g };
			subRings.push( new SwimRingChart(ringGroups, ringOpions) );
		}
		rings.push(subRings);
	}
	return rings;
}

MRing.prototype.wrapRing = function(data){
	var wrapOptions = {g: this.g, 
		r1: this.r1, 
		r2: this.r2, 
		startangle: data.startangles[0] || 0, 
		strokeWidth: "4", 
		strokeColor: "#fff",
		disableActiveHandler: true
	};
	return new SwimRingChart( data.wrapGroups, wrapOptions );
}

MRing.prototype.update = function(groups){
	var data = this.cookData(groups);
	var total = Math.ceil( this.getTotal(this.data, data) );
	var angleGaps = this.getAngleGaps(this.data, data, total);
	var radiuGaps = this.getRadiuGaps(this.data, data, total);

	var self = this;
	var count = 0;
	var intervalId = setInterval(function(){
		count++;
		if(count < total){
			var startangle = self.data.startangles[0];
			for(var i = 0, len1 = self.rings.length; i < len1; i++){
				var subRings = self.rings[i];
				var previousR1 = self.r2;
				for(var j = 0, len2 = subRings.length; j < len2; j++){
					var wingR = self.data.wingRadius[i][j];
					subRings[j].r1 = previousR1 + (wingR.r1 - wingR.r2) + radiuGaps[i][j] * count;
					subRings[j].r2 = previousR1;
					var trace = subRings[j].getTrace(startangle, self.data.angles[i] + angleGaps[i] * count);
					subRings[j].pathes[0].setAttribute("d", trace);
					previousR1 = subRings[j].r1;
				}
				var trace = self.wring.getTrace(startangle, self.data.angles[i] + angleGaps[i] * count);//TBD
				self.wring.pathes[i].setAttribute("d", trace);//TBD
				startangle += self.data.angles[i] + angleGaps[i] * count;
			}
		}else{
			var startangle = self.data.startangles[0];
			for(var i = 0, len1 = self.rings.length; i < len1; i++){
				var subRings = self.rings[i];
				for(var j = 0, len2 = subRings.length; j < len2; j++){
					var trace = subRings[j].getTrace(startangle, data.angles[i]);
					subRings[j].pathes[0].setAttribute("d", trace);
				}
				var trace = self.wring.getTrace(startangle, data.angles[i]);//TBD
				self.wring.pathes[i].setAttribute("d", trace);//TBD
				startangle += data.angles[i];
			}

			self.groups = groups;
			self.data = data;
			clearInterval(intervalId);
		}

	}, MRing.SPEED);
}

MRing.prototype.getTotal = function(data1, data2){
	var max = 0;
	for(var i = 0, len1 = data2.angles.length; i < len1; i++){
		var count = Math.abs(data2.angles[i] - data1.angles[i]) / MRing.PIECE_ANGLE;
		if(count > max){
			max = count;
		}

		var subWingRadius2 = data2.wingRadius[i];
		var subWingRadius1 = data1.wingRadius[i];
		for(var j = 0, len2 = subWingRadius2.length; j < len2; j++){
			var count = Math.abs( subWingRadius2[j] - subWingRadius1[j] ) / MRing.PIECE_DISTANCE;
			if(count > max){
				max = count;
			}
		}
	}
	return max;
}

MRing.prototype.getAngleGaps = function(data1, data2, total){
	var angleGaps = [];
	for(var i = 0, len1 = data2.angles.length; i < len1; i++ ){
		angleGaps.push( (data2.angles[i] - data1.angles[i] ) / total );
	}
	return angleGaps;
}

MRing.prototype.getRadiuGaps = function(data1, data2, total){
	var radiuGaps = [];
	for(var i = 0, len1 = data2.wingRadius.length; i < len1; i++ ){
		var subRadiuGaps = [];
		var subWingRadius2 = data2.wingRadius[i];
		var subWingRadius1 = data1.wingRadius[i];
		for(var j = 0, len2 = subWingRadius2.length; j < len2; j++){
			subRadiuGaps.push( ( (subWingRadius2[j].r1 - subWingRadius2[j].r2)  - (subWingRadius1[j].r1 - subWingRadius1[j].r2 ) ) / total );
		}
		radiuGaps.push(subRadiuGaps);
	}
	return radiuGaps;
}


