'use strict';

/* Controllers */

(function(r) {

	
  var bucket = r('#buckets');

	var home = River('#home-page');
	var detail = River('#detail-page');
	var brand = River('.brand');
	var page = r('#home-stage');

	var loading = r('.mask');


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
		home.attr('style',prefix + 'transform:scale(5)');
		detail.attr('style',prefix + 'transform:scale(1)');
	}

	var goToTab = function (url){
		lastTab.item.removeClass('active');
    lastTab.content.removeClass('active');
    tabs[url].item.addClass('active');
    tabs[url].content.addClass('active');
    lastTab = tabs[url];
	}

	var loadTmp = function(name) {
		return River.http.get('assets/js/view/'+ name +'.html');;
	}

	var Buffer = {};

	var pageDrive = function () {
		var url = window.location.hash.slice(2);
		if(/post/.test(url)){
			brand.attr('href','#/type/' + url.slice(5).split('/')[0] );
			goToDetail();
			detail.getRef().children[0].src = url.match(/\/\d.*/)[0];
			page.attr( 'style', prefix + 'transform:translateX(-50%)');
		}else if(/home/.test(window.location.hash.slice(2))){
        page.attr( 'style', prefix + 'transform:translateX(0)');
    }
	}

	var needAnimate = function (flag){
		if(flag){
			home.addClass('transition');
			detail.addClass('transition');
			page.addClass('transition-short');
		}else{
			home.removeClass('transition');
			detail.removeClass('transition');
			page.removeClass('transition-short');
		}
	}


	function goBlogList (){
		var url = window.location.hash.slice(2);
		if(/type/.test(url)){
			brand.attr('href','#/home/');
			backToHome();
			var p = url.slice(5);
			if(!Buffer[p]){
				loading.addClass('show');
				loadTmp(p).done(function(xhr){
					Buffer[p] = River.compail(xhr.responseText);
					bucket.empty().append(Buffer[p]);
					loading.removeClass('show');
					page.attr( 'style', prefix + 'transform:translateX(-50%)');
				})
			}else{
				bucket.empty().append(Buffer[p]);
				page.attr( 'style', prefix + 'transform:translateX(-50%)');
			}
			setTimeout(function() {
				detail.getRef().children[0].src = '';
			}, 600);
		}
	}

	function getBlogList(){
		var url = window.location.hash.slice(2);
		if(/type/.test(url)){
			brand.attr('href','#/home/');
			backToHome();
			var p = url.slice(5);
			loadTmp(p).done(function(xhr){
				Buffer[p] = River.compail(xhr.responseText);
				bucket.empty().append(Buffer[p]);
			})
			page.attr( 'style', prefix + 'transform:translateX(-50%)');
		}
	}



	window.addEventListener('hashchange',function(){
	 //need animation
		needAnimate(true);
		pageDrive();
		goBlogList();
	})

	//no animation
	needAnimate(false);
	pageDrive();
	getBlogList();

})(River)