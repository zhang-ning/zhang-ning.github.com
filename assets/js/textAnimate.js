'use strict';

(function(r,win){

	r.compoment('textAnimate',function(){

		var _test_data = ['ux','wiled','girl','boy','greate','programmer','feature', 'developer','your friends','UX developer'];
		var _text_data2 = ['apple','microsoft','tibco','weibo','future']

		var target = this[0];
		

		target.text("who we are ? ");

		function _loop () {
			target.text(_test_data.shift());
			if(_test_data.length) {setTimeout(function() {
					River.requestAnimationFrame.call(win,_loop);
				}, 100);
			}
		}

		return {
			execute : _loop
		};

	});

})(River,window);