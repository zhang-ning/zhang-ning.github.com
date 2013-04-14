'use strict';

/* Controllers */

(function() {

	function getInstanceOf (obj) {
		var F = function(){};
		F.prototype = obj;
		return new F;
	}

	var Deffer = {
		resolve : function(data){
			this.donecallback(data);
		},
		reject : function(data){
			this.failcallback(data);
		},
		done : function(callback){
			this.donecallback = callback;
		},
		fail : function(callback){
			this.failcallback = callback;
		},
		parameters:{}
	};

	var http = {
		get : function(url) {
			var request = new XMLHttpRequest();
			request.open("GET",url,true);
			request.send();
			var deffer = getInstanceOf(Deffer);
			request.onreadystatechange= function(){
				if (request.readyState==4 && request.status==200){
					deffer.resolve(request);
				}
			}
			return deffer;
		},
		post : function(url) {
			var request = new XMLHttpRequest();
			request.open("POST",url,true);
			request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			request.send();
			var deffer = getInstanceOf(Deffer);
			request.onreadystatechange= function(){
				if (request.readyState==4 && request.status==200){
					deffer.resolve();
				}
			}
			return deffer;
		}
	}

	function compail (string) {
		var div = document.createElement('div');
		div.innerHTML = string;
		return div;
		//var parser = new DOMParser();
		//return parser.parseFromString(string, "text/xml");
	}

	function River(ref){
		if(typeof ref === 'string'){
			ref = document.querySelector(ref);
		}
		var h = ref.className;
		
		return {
			addClass: function(c){
				var cn = new RegExp(c);
				 ref.className = cn.test(h) ? h : h + ' ' + c;
				 return this;
			},
			removeClass: function(c){
				ref.className = h.split(' ').filter(function(v){
					if( c !== v)
					return v;
				}).join(' ');
				return this;
			},
			attr:function(p,v){
				ref.setAttribute(p,v)
				return this;
			}
			,
			getRef:function(){
				return ref;
			}
		}
	}

	var prefix = (function(){
		var b = window.navigator.userAgent.match(/safari|chrome|firefox|msie/i)[0];
		return /chrome|safari/i.test(b) ? '-webkit-' : /firefox/i.test(b) ? '-moz-' : '-ms-'; 
	})();

	//window.addEventListener('load',function(){

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
	//})

})()