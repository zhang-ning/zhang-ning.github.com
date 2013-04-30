'use strict';

/* home */

(function(r){

    r.compoment('galary',function(){

      var lastLeft , lastCenter , lastRight , leftOut, rightOut;

      if( this.length >= 3 ){
        lastCenter = this[0].addClass('gl-center');
        lastLeft =  lastCenter.previous().addClass('gl-left');
        leftOut = lastLeft.previous().addClass('gl-l-out');
        lastRight = lastCenter.next().addClass('gl-right');
        rightOut = lastRight.next().addClass('gl-r-out');
      };

      function _previous () {
        rightOut = lastRight.attr('class','item transition gl-r-out');
        lastRight = lastCenter.attr('class','item transition gl-right');
        lastCenter = lastLeft.attr('class','item transition gl-center');
        lastLeft = leftOut.attr('class','item transition gl-left');
        leftOut = leftOut.previous().attr('class','item transition gl-l-out');
      };

      function _next () {
        leftOut = lastLeft.attr('class','item transition gl-l-out');
        lastLeft = lastCenter.attr('class','item transition gl-left');
        lastCenter = lastRight.attr('class','item transition gl-center');
        lastRight = rightOut.attr('class','item transition gl-right'); 
        rightOut = rightOut.next().attr('class','item transition gl-r-out');

      };

      return {
        previous : _previous,
        next : _next
      }

    });


    var galary = r.selectAll('.galary .item').galary();

    r('.gl-prev').bind('click', function(){
      galary.previous();
    })
    r('.gl-next').bind('click', function(){
      galary.next();
    })
    
})(River);