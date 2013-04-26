'use strict';

/* Controllers */

(function() {

	var home = River('#home-page');
	var detail = River('#detail-page');


	var tabs = {
		blog : {
			item : River('#blog-tab'),
			content : River('#blog-content')
		},
		music : {
			item : River('#music-tab'),
			content : River('#music-content')
		},
		video : {
			item : River('#video-tab'),
			content : River('#video-content')
		},
		dota : {
			item : River('#dota-tab'),
			content : River('#dota-content')
		}
	};

	var lastTab = tabs.blog;

	var backToHome = function	() {
		home.attr('style',prefix + 'transform:scale(1)')
		detail.attr('style',prefix + 'transform:scale(0)')
	}

	var goToDetail = function () {
		home.attr('style',prefix + 'transform:scale(5)')
		detail.attr('style',prefix + 'transform:scale(1)')
	}

	var goToTab = function (url){
		lastTab.item.removeClass('active');
	    lastTab.content.removeClass('active');
	    tabs[url].item.addClass('active');
	    tabs[url].content.addClass('active');
	    lastTab = tabs[url];
	}

	var pageDrive = function () {
		var url = window.location.hash.slice(2);
		if(/post/.test(url)){
			goToDetail();
			detail.getRef().children[0].src = url.slice(4);
			// detail.getRef().children[0].addEventListener('load',function(){
			// 	console.log(11);
			// });
		}else if(/tab/.test(url)){
			goToTab(url.slice(4));
		}else{
			backToHome();
			setTimeout(function() {
				detail.getRef().children[0].src = '';
			}, 600);
		}
	}

	var needAnimate = function (flag){
		if(flag){
			home.addClass('transition');
			detail.addClass('transition');
		}else{
			home.removeClass('transition')
			detail.removeClass('transition')
		}
	}



	window.addEventListener('hashchange',function(){
		needAnimate(true);
		pageDrive();
	})

	needAnimate(false);
	pageDrive();

})()