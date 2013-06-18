'use strict';

(function(r,win){

	r.compoment('textAnimate',function(){

		var target = this[0];
		var data = [];

		this.forEach(function(v,i){
			if(0 !== i){
				v.style('display','none');
			}
			data.push(v.text());
		});


		function _next(){
			if(!this.index || this.length === this.index){
				this.index = 0;
			}
			return this[this.index++];
		}

		

		function _animation(){
			var ad = ['ux','wiled','girl','boy','greate','programmer', 'developer','friends','UX','U.S.A','Japan','Korea','Britain','China'];
			var times = 0;
			var deffer = getInstanceOf(Deffer);

			function loop(){
				target.text(_next.call(ad));
				if(times <= (ad.length-1) ){
					setTimeout(function() {
						loop();
					}, 100);
					times++;
				}else{
					times = 0;
					deffer.resolve();
				}
			}
			loop(target);
			return deffer;
		}

		_next.call(data);
		function query(){
			_animation().done(function(){
				target.text(_next.call(data));
			});
		}
		//console.log(data);

		return {
			execute : query
		};

	});

})(River,window);