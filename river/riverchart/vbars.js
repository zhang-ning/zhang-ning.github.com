function  VBars (groups, options) {
	this.groups = groups;
	this.g = options.g;
	this.options = options;
	this.bars = [];
	this.texts = [];

	this.vBars();
	this.axises();
}
VBars.PIECE = 8;
VBars.SPEED = 16;

VBars.prototype.vBars = function(){
	var elm;
	var pos;
	var baseBar;
	for(var i = 0, len = this.groups.length; i < len; i++){
		pos = { x: this.options.X + i * (this.options.W + this.options.GAP) + this.options.GAP, 
				y: this.options.Y, 
				w: this.options.W, 
				h: this.groups[i].value };
		elm = drawer.rectV(pos.x, pos.y, pos.w, pos.h, {"fill": this.groups[i].color});
		baseBar = drawer.rectV(pos.x + (this.options.W - this.options.BASE_BAR_W)/2, pos.y, this.options.BASE_BAR_W, this.options.BASE_BAR_L);
		baseBar.setAttribute("class", "base-bar");
		this.bars.push({pos: pos, elm: elm, val: this.groups[i].value});
		this.g.appendChild(baseBar);
		this.g.appendChild(elm);
	}
}
VBars.prototype.axises = function (){
	for(var i = 0, len = this.bars.length; i < len; i++){
		var pos = this.bars[i].pos;
		var x1 = pos.x - 1/2*this.options.GAP;
		var y1 = pos.y;
		var x2 = pos.x + this.options.W + 1/2*this.options.GAP;
		var y2 = y1;
		var line = drawer.drawLine(x1, y1, x2, y2);
		line.setAttribute("class", "base-line");
		this.g.appendChild(line);

		var text = drawer.drawText(pos.x + 1/2*this.options.W, this.options.Y + 0.5*this.options.GAP, this.groups[i].title);
		text.setAttribute("class", "v-bar-title");
		this.g.appendChild(text);

		var text = drawer.drawText(pos.x + 1/2*this.options.W, pos.y - this.options.BASE_BAR_L - 0.5*this.options.GAP, this.groups[i].value);
		text.setAttribute("class", "v-bar-value");
		this.g.appendChild(text);
		this.texts.push(text);
	}
}
VBars.prototype.update = function(groups){
	var total = this.getTotal(groups);
	var gaps = this.getGaps(groups, total);

	var count = 0;
	var self = this;
	var intervalId = setInterval( function(){
		count++;
		if(count < total){
			for(var i = 0, len = self.groups.length; i < len; i++){
				var bar = self.bars[i];
				var trace = drawer.rectVTrace( bar.pos.x, bar.pos.y, bar.pos.w, bar.pos.h + gaps[i] * count);
				bar.elm.setAttribute("d", trace);
			}
		}else{
			for(var i = 0, len = self.groups.length; i < len; i++){
				var bar = self.bars[i];
				var trace = drawer.rectVTrace( bar.pos.x, bar.pos.y, bar.pos.w, groups[i].value);
				bar.elm.setAttribute("d", trace);

				bar.pos.h = groups[i].value;
				bar.val = groups[i].value;
				self.texts[i].textContent = groups[i].value;
			}
			self.groups = groups;
			clearInterval(intervalId);
		}
	}, VBars.SPEED);

}
VBars.prototype.getTotal = function(groups){
	var max = 0;
	for(var i = 0, len = groups.length; i < len; i++){
		if(Math.abs(groups[i].value - this.groups[i].value) > max){
			max = Math.abs(groups[i].value - this.groups[i].value);
		}
	}
	var total = max / VBars.PIECE;
	return total;
}
VBars.prototype.getGaps = function(groups, total){
	var gaps = [];
	for(var i = 0, len = groups.length; i < len; i++){
		gaps.push( ( groups[i].value - this.groups[i].value ) / total );
	}
	return gaps;
}