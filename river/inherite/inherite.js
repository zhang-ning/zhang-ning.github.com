function A (p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
}
A.prototype.say = function(){
	console.log("say hi...");
}

function B(p1, p2, p3){
	A.apply(this, [p1, p2]);
	this.p3 = p3;
}
B.prototype = new A();
delete B.prototype.p1;
delete B.prototype.p2;
B.prototype.constructor = B;
B.prototype.sing = function(){
	console.log("sing a song...");
}


function demoInherite(){
	var b = new B("River", "22", "student");
	var a = new A("Jonathan", "21");
	console.log(b);
	console.log(a);
	b.say();
	b.sing();
}


var reg = /(\w+)[@](\w+)[.](\w+)/;
var result = "123r-_iver.d-_23eng@yahoo.c_-o567m".match(reg);
console.log(result);