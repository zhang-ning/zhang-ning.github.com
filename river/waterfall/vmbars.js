function  VMBars (groups, options) {
	this.groups = groups;
	this.g = options.g;
	this.options = options;
	this.bars = [];
	this.texts = [];

	this.vmBars();
	this.axises();
}
VMBars.PIECE = 8;
VMBars.SPEED = 16;

VMBars.prototype.vmBars = function(){
	for(var i = 0, len1 = this.groups.length; i < len1; i++){
		var subGroups = this.groups[i].groups;
		var x = this.options.X + i * (this.options.W + this.options.GAP) + this.options.GAP;
		var y = this.options.Y;
		var subBars = [];
		for(var j = 0, len2 = subGroups.length; j < len2; j++){
			var pos = { x: x, y: y, w: this.options.W, h: subGroups[j].value };
			var elm = drawer.rectV(pos.x, pos.y, pos.w, pos.h, {"fill": subGroups[j].color});
			subBars.push({pos: pos, elm: elm, val: subGroups[j].value});
			this.g.appendChild(elm);
			y -= subGroups[j].value;
		}
		this.bars.push(subBars);
	}
}
VMBars.prototype.axises = function (){
	for(var i = 0, len = this.bars.length; i < len; i++){
		var pos = this.bars[i][0].pos;
		var x1 = pos.x - 1/2*this.options.GAP;
		var y1 = pos.y;
		var x2 = pos.x + this.options.W + 1/2*this.options.GAP;
		var y2 = y1;
		var line = drawer.drawLine(x1, y1, x2, y2);
		line.setAttribute("class", "base-line");
		this.g.appendChild(line);

		var text = drawer.drawText(pos.x + 1/2*this.options.W, this.options.Y + 1.5*this.options.GAP, this.groups[i].title);
		text.setAttribute("class", "v-bar-title");
		this.g.appendChild(text);

		/*var text = drawer.drawText(pos.x + 1/2*this.options.W, pos.y - this.options.BASE_BAR_L - 0.5*this.options.GAP, this.groups[i].value);
		text.setAttribute("class", "v-bar-value");
		this.g.appendChild(text);
		this.texts.push(text);*///TBD
	}
}
VMBars.prototype.update = function(groups){
	var total = this.getTotal(groups);
	var gaps = this.getGaps(groups, total);

	var count = 0;
	var self = this;
	var intervalId = setInterval( function(){
		count++;
		if(count < total){
			for(var i = 0, len = self.groups.length; i < len; i++){
				var y = self.options.Y;
				for(var j = 0, len2 = groups[i].groups.length; j < len2; j++){
					var bar = self.bars[i][j];
					var trace = drawer.rectVTrace( bar.pos.x, y, bar.pos.w, bar.pos.h + gaps[i][j] * count);
					bar.elm.setAttribute("d", trace);
					y -= bar.pos.h + gaps[i][j] * count;
				}
			}
		}else{
			for(var i = 0, len = self.groups.length; i < len; i++){
				var y = self.options.Y;
				for(var j = 0, len2 = groups[i].groups.length; j < len2; j++){
					var bar = self.bars[i][j];
					var trace = drawer.rectVTrace( bar.pos.x, y, bar.pos.w, groups[i].groups[j].value);
					bar.elm.setAttribute("d", trace);
					y -= groups[i].groups[j].value;

					bar.pos.h = groups[i].groups[j].value;
					bar.val = groups[i].groups[j].value;
					//self.texts[i].textContent = groups[i].value; //TBD
				}
			}
			self.groups = groups;
			clearInterval(intervalId);
		}
	}, VMBars.SPEED);

}
VMBars.prototype.getTotal = function(groups){
	var max = 0;
	for(var i = 0, len = groups.length; i < len; i++){
		for(var j = 0, len2 = groups[i].groups.length; j < len2; j++){
			var valueDiff = Math.abs( groups[i].groups[j].value - this.groups[i].groups[j].value );
			if(valueDiff > max){
				max = valueDiff;
			}
		}
	}
	var total = max / VMBars.PIECE;
	return total;
}
VMBars.prototype.getGaps = function(groups, total){
	var gaps = [];
	for(var i = 0, len = groups.length; i < len; i++){
		var subGaps = [];
		for(var j = 0, len2 = groups[i].groups.length; j < len2; j++){
			subGaps.push( ( groups[i].groups[j].value - this.groups[i].groups[j].value ) / total );
		}
		gaps.push(subGaps);
	}
	return gaps;
}