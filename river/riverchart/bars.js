function  HBars (groups, options, callback) {
	callback && (this.callback = callback);

	this.g = options.g;
	this.options = options;
	this.bars = [];
	this.texts = [];

	this.groups = this.initData(groups);
	this.hBars();
	this.axises(groups);
	this.update(groups);
}
HBars.GAP_X = 8;
HBars.GAP_H = 5;
HBars.STROKE_WIDTH = 4;
HBars.PIECE = 8;
HBars.SPEED = 16;

HBars.prototype.initData = function(groups){
	var groups2 = [];
	for(var i = 0, len = groups.length; i < len; i++){
		groups2.push({value: 0, color: groups[i].color});
	}
	return groups2;
}

HBars.prototype.hBars = function(){
	var elm;
	var pos;
	var baseBar;
	for(var i = 0, len = this.groups.length; i < len; i++){
		pos = { x: this.options.X, 
				y: this.options.Y + i * (this.options.H + this.options.GAP) + this.options.GAP, 
				w: this.groups[i].value, 
				h: this.options.H };
		elm = drawer.rectH(pos.x, pos.y, pos.w, pos.h, {"fill": this.groups[i].color});
		baseBar = drawer.rectH(pos.x, pos.y + (this.options.H - this.options.BASE_BAR_H)/2, this.options.BASE_BAR_W, this.options.BASE_BAR_H);
		baseBar.setAttribute("class", "base-bar");
		this.bars.push({pos: pos, elm: elm, val: this.groups[i].value});
		this.g.appendChild(baseBar);
		this.g.appendChild(elm);
	}
}
HBars.prototype.axises = function (groups){
	for(var i = 0, len = this.bars.length; i < len; i++){
		var pos = this.bars[i].pos;
		var x1 = pos.x - HBars.GAP_X - 1/2 * HBars.STROKE_WIDTH;
		var y1 = pos.y - HBars.GAP_H;
		var x2 = x1;
		var y2 = y1 + pos.h + 2 * HBars.GAP_H;
		var line = drawer.drawLine(x1, y1, x1, y2);
		line.setAttribute("class", "base-line");
		this.g.appendChild(line);

		var text = drawer.drawText(pos.x - 2 * HBars.GAP_X - HBars.STROKE_WIDTH, pos.y + pos.h, groups[i].title);
		text.setAttribute("class", "h-bar-title");
		this.g.appendChild(text);

		var text = drawer.drawText(this.options.X + this.options.BASE_BAR_W + HBars.GAP_X, pos.y + pos.h, groups[i].value);
		text.setAttribute("class", "h-bar-value");
		this.g.appendChild(text);
		this.texts.push(text);
	}
}
HBars.prototype.update = function(groups){
	this.processingNotify();

	var total = this.getTotal(groups);
	var gaps = this.getGaps(groups, total);

	var count = 0;
	var self = this;
	var intervalId = setInterval( function(){
		count++;
		if(count < total){
			for(var i = 0, len = self.groups.length; i < len; i++){
				var bar = self.bars[i];
				var trace = drawer.rectHTrace( bar.pos.x, bar.pos.y, bar.pos.w + gaps[i] * count, bar.pos.h );
				bar.elm.setAttribute("d", trace);
			}
		}else{
			for(var i = 0, len = self.groups.length; i < len; i++){
				var bar = self.bars[i];
				var trace = drawer.rectHTrace( bar.pos.x, bar.pos.y, groups[i].value, bar.pos.h );
				bar.elm.setAttribute("d", trace);

				bar.pos.w = groups[i].value;
				bar.val = groups[i].value;
				self.texts[i].textContent = groups[i].value;
			}
			self.groups = groups;
			clearInterval(intervalId);
			
			self.completingNotify();
		}
	}, HBars.SPEED);

}
HBars.prototype.getTotal = function(groups){
	var max = 0;
	for(var i = 0, len = groups.length; i < len; i++){
		if(Math.abs(groups[i].value - this.groups[i].value) > max){
			max = Math.abs(groups[i].value - this.groups[i].value);
		}
	}
	var total = max / HBars.PIECE;
	return total;
}
HBars.prototype.getGaps = function(groups, total){
	var gaps = [];
	for(var i = 0, len = groups.length; i < len; i++){
		gaps.push( ( groups[i].value - this.groups[i].value ) / total );
	}
	return gaps;
}

HBars.prototype.processingNotify = function(){
	if(this.callback){
		if(this.callback.processing && typeof this.callback.processing === "function"){
			this.callback.processing();
		}
	}
}
HBars.prototype.completingNotify = function(){
	if(this.callback){
		if(this.callback.completing && typeof this.callback.completing === "function"){
			this.callback.completing();
		}
	}
}
