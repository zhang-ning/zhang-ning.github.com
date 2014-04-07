

function exchange(a, i, j, records) {
	var temp = a[i];
	a[i] = a[j];
	a[j] = temp;

	records.push([i, j]);
}

function Queue (data) {
	this.index = 0;
	this.data = data ? data : [];
}
Queue.prototype.push = function (item) {
	this.data.push(item);
}
Queue.prototype.pop = function () {
	return this.remove(0);
}
Queue.prototype.remove = function (i) {
	var item = this.data[i];
	for(var len = this.length() - 1; i < len; i++){
		this.data[i] = this.data[i + 1];
	}
	this.data.length--;
	return item;
}
Queue.prototype.current = function() {
	return this.data[this.index];
}
Queue.prototype.hasNext = function () {
	return this.index < this.length() - 1 ? true : false;
}
Queue.prototype.moveNext = function() {
	if(this.hasNext()){
		this.index++;
		return this.index;
	}else{
		return null;
	}
}
Queue.prototype.getCurrent = function () {
	return this.index;
}
Queue.prototype.next = function () {
	if(this.hasNext()){
		this.moveNext();
		return this.current();
	}else{
		return null;
	}
}
Queue.prototype.setCurrent = function (index) {
	if(index < this.length()){
		this.index = index;
	}else{
		return false;
	}
}
Queue.prototype.length = function () {
	return this.data.length;
}
Queue.prototype.toString = function() {
	var textContent = "";
	for(var i = 0, len = this.length(); i < len; i++){
		textContent += " " + this.data[i].card.textContent;
	}
	return textContent;
};