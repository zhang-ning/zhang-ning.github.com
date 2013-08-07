---
layout : post
title: "The share on learning Angualr&Bootstrap"
comments: true
summary : "HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop."
---


*** 
>About the AngularJS


1. What are the good things about Angular?
   
   * extend HTML tags/attributes by defining directive
   * easy to synchronize the view and the model by binding
   * the template engine is easy to manipulate and maintain, the template language is popular and easy to understand.
   * suit for writting unit testing for avoiding regression issue.
   * suit for writting end to end test.

2. What are the fallback of angular?
   
   * the "ng-click" does not support mobile touch event , we have to create another directive to replace it.

   * as we know the mobile -webkit- browser will stop "setTimeOut,setInnterval" when scrolling page,
      but in AngulaJS  there are several features are based on "setTimeOut,setInnterva",
      for example the model and view sync feature .

   * according the upside two point, I'm not sure AngularJS is steable for mobile app.
       

---
>About the bootstrap

1. the good things about bootstrap
   
   * I have to say , the offical document on how to work with bootstrap is really good.
   * the 9 or 12 grid system , has the abillity for responsive web design. 
   * the customize on default UI is convenient.
   * speed up daily work.
   * It's a good OOCss framwork.

2. the fallback of bootstrap
   * At the beginning it's not built for suiting Angular, there are some compoment events implemented with jQuery.So when we combine it with Angular, we should turn the part built by jQuery into Angular directive.

---
>Sample code

 1. the uxclick directive to instead ng-click for crossing touch and click event


<pre>
<xmp><span uxclick="yourFn()"></span> // cross touch</xmp>
</pre>



<pre>
(function(){
  'use strict';
    spotlight.directive('uxclick',function($window){
      var click = 'click';
      return {
        restrict: 'A',
        link : function(scope, element, attrs) {
          if(typeof window.ontouchend !== "undefined"){
            var startX ;
            element.bind('touchstart',function(e){
              startX = e.changedTouches[0].pageX
            });
            element.bind('touchend',function(e){
              if(Math.abs(e.changedTouches[0].pageX - startX) < 10){
                scope.$apply(attrs.uxclick);
              }
            })
          }else{
            element.bind('click',function(e){
              scope.$apply(attrs.uxclick);
            })
          }
        }
      }
    });
})();
</pre>

{{page.date | date_to_string }}
