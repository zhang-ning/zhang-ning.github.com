function getInstanceOf (obj) {
    var F = function(){};
    F.prototype = obj;
    return new F;
}

var Deffer = {
  resolve : function(data){
    var callbacks = this.donecallback;
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](data);
    };
  },
  reject : function(data){
    this.failcallback(data);
  },
  done : function(callback){
    if(!this.donecallback){
      this.donecallback = [];
    }
    this.donecallback.push(callback);
    return this;
  },
  fail : function(callback){
    this.failcallback = callback;
  },
  parameters:{}
};
var prefix = (function(){
  var b = window.navigator.userAgent.match(/safari|chrome|firefox|msie/i)[0];
  return /chrome|safari/i.test(b) ? '-webkit-' : /firefox/i.test(b) ? '-moz-' : '-ms-'; 
})();


function River(ref){
  
  if(typeof ref === 'string'){
    ref = document.querySelector(ref);
  }

  return {
    previous: function(){
      return River(ref.previousElementSibling);
    },
    next: function(){
      return River(ref.nextElementSibling);
    },
    addClass: function(c){
      var h = ref.className;
      var cn = new RegExp(c);
      //to-do
      ref.className = cn.test(h) ? h : h + ' ' + c;
      return this;
    },
    removeClass: function(c){
      var h = ref.className;
      ref.className = h.split(' ').filter(function(v){
        if( c !== v)
        return v;
      }).join(' ');
      return this;
    },
    attr:function(p,v){
      ref.setAttribute(p,v)
      return this;
    },
    style:function(p,v){
      ref.style[p] = v ;
      return this;
    },
    getRef:function(){
      return ref;
    },
    on:function(eve,target,callback){
      var dom;
      ref.addEventListener(eve,function(e){
        if(!dom)dom = River(target).getRef();
        if(e.target === dom){
          callback(e);
        }
      },false);
      return this;
    },
    bind:function(eve,callback){
      var __this = this;
      ref.addEventListener(eve,function(e){
        callback.call(__this,e);
      })
      return this;
    },
    find:function(k){
      var es = [];
      Array.prototype.forEach.call(ref.querySelectorAll(k),function(ele){
        es.push(River(ele));
      });
      return es;
    },
    child:function(index){
      if("number" !== typeof index){
        index = 0;
      }
      return River(ref.children[index]);
    },
    text:function(v){
      ref.textContent = v;
      return this;
    },
    remove:function(){
      ref.parentNode.removeChild(ref);
      return null;
    },
    append:function(d){
      ref.appendChild(d.getRef());
      return this;
    },
    empty:function(){
      while(ref.firstChild) {
        ref.removeChild(ref.firstChild);
      }
      return this;
    },
    animate:function(p,v,t){
      var deffer = getInstanceOf(Deffer);

      var distance = parseInt(v) - parseInt(ref.style[p]);

      var s = 13;
      var frames = parseInt(t/s);
      var i = 0 ;

      var d = distance/frames ;

      var loopID = setInterval(function() {
        i++;
        ref.style[p] = d * i;
        if( i === frames ) {
          clearInterval(loopID);
          deffer.resolve();
        }
      }, s);

      return deffer;
    }
  }
}

River.compail = function(string){
  var div = document.createElement('div');
  div.innerHTML = string;
  return River(div.children[0]);
}

River.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})()

River.selectAll = function(ref){
  var result = [];
  if(typeof ref === 'string'){
    var dom = document.querySelectorAll(ref);
    for (var i = 0; i < dom.length; i++) {
      
      //generate a new River;
      var river = this(dom[i]);
      river.index = i ;

      //avoid this scope fall in caous 
      var d = result;

      //over write previous and next method
      river.previous = function(){
        var currentIndex = this.index;

        if(currentIndex-1 >= 0 ){
          currentIndex--;
        }else{
          currentIndex = d.length-1;
        }
        return d[currentIndex] ;
      }

      river.next = function(){
        var currentIndex = this.index;
        
        if(currentIndex+1 < d.length){
          currentIndex++
        }else{
          currentIndex = 0;
        }
        return d[currentIndex];
      };

      result.push(river);

    };
  }
  for (var x in this.apps) {
    result[x] = this.apps[x];
  };

  return result;
}


River.apps = {
  bind : function(eve,imp){
    for (var i = 0; i < this.length; i++) {
      this[i].bind(eve,imp);
    };
    return this;
  }
};

River.compoment = function(name,implement){
  this.apps[name] = implement;
}

River.http = {
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

