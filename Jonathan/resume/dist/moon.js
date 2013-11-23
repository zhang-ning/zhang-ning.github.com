/* 
 * all rights resorved by hunter.dding@gmail.com @猎人丁丁
 * the Gloable variable may presents , Resume, main, define
 * the create method is for define a group of feature in one module
 * and the run method is just for run your app like the main entrance of what other language do
 *
 */
var app = {
  // module define and run api
  sandbox: function() {
    var boxes = {};
    return {
      create: function(key, fn) {
        key = key.toLowerCase();
        boxes[key] = fn;
      },
      run: function(fn) {
        var context = {
          need: function(key) {
            key = key.toLowerCase();
            return boxes[key] && boxes[key].call(context) || undefined;
          }
        };
        fn.call(context);
      }
    };
  }
};

var modules = app.sandbox();
/*jshint unused:false */
var define = modules.create;
var main = modules.run;


main(function() {

  var grammer = {};
  var me = this;

  function getGrammer(key) {
    if (!grammer[key]) {
      var module = me.need('grammer.' + key);
      if (module) {
        grammer[key] = module;
      }
    }
  }

  // this reg is for math {{ **.** }} type expression
  var reg = /^\s*{{\s*|\s*}}\s*$/g;


  var context = {
    scope: {},
    node: {},
    eom: {},
    reg: reg
  };



  function scan(doc) {
    var hasRepeat = false;
    if (doc.attributes && doc.attributes.length) {
      Array.prototype.forEach.call(doc.attributes, function(attr) {
        var key = attr.nodeName;
        //import source
        getGrammer(key);
        if (grammer[key]) {
          context.node = doc;
          // if current element has repeat attr , we need to stop scanning his children
          if ('repeat' === attr.nodeName) {
            hasRepeat = true;
          }
          grammer[key].call(context, attr.nodeValue.replace(reg, ''));
        }
      });
    }
    if (reg.test(doc.nodeValue)) {
      var key = doc.nodeValue.replace(reg, '');
      doc.nodeValue = context.scope[key];
      if(!context.eom[key]){
        context.eom[key] = [];
      }
      context.eom[key].push(doc);
    }
    if (doc.childNodes && doc.childNodes.length && !hasRepeat) {
      Array.prototype.forEach.call(doc.childNodes, function(child) {
        scan(child);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    scan(document);
  });

});

define('grammer.jbind',function(){

  function jbind (str){
    var scope = this.scope;
    this.node.onkeyup = function(){
      scope[str] = this.value;
      scope.apply();
    };
  }

  return jbind;

});

define('grammer.jChange', function() {
  function change (str) {
    var fn = this.scope[str];
    var scope = this.scope;

    this.node.onchange = function(){
      fn.call({},this.value);
      scope.apply();
    };
  }
  return change;
});

define("grammer.repeat", function() {

  /**
   * all the grammer 'this' object contains,this the base api
   * {
   *  node:,
   *  reg:,
   *  scope,
   *  eom
   *  }
   **/


  function repeat(str) {
    //to-do
    var afterIn = /.*in\s/;
    var beforeIn = /\sin.*/;
    var ns = /.*\./;
    var pro = str.replace(afterIn, '').replace(ns, '');
    var data = this.scope[pro];
    var key = str.replace(beforeIn, '');
    var parentNode = this.node.parentNode;
    var node = parentNode.removeChild(this.node);
    var frg = document.createDocumentFragment();
    var _r = this.reg;
    var eom = this.eom[pro] = [];


    node.removeAttribute('repeat');

    if (data && data.length) {
      data.forEach(function(d) {
        var _n = node.cloneNode(true);
        var m = {};
        trans(_r, _n, d, key, m);
        eom.push(m);
        frg.appendChild(_n);
      });
      parentNode.appendChild(frg);
    }
  }

  var context = {};


  function trans(reg, doc, scope, key, eom) {
    var hasRepeat = false;
    if (doc.attributes && doc.attributes.length) {
      Array.prototype.forEach.call(doc.attributes, function(attr) {
        if ('repeat' === attr.nodeName) {
          hasRepeat = true;
          context.node = doc;
          context.scope = scope;
          context.reg = reg;
          context.eom = eom;
          repeat.call(context, attr.nodeValue.replace(reg, ''));
        }
      });
    }
    if (reg.test(doc.nodeValue)) {
      var k = doc.nodeValue.replace(reg, '').replace(key + '.', '');
      doc.nodeValue = scope[k];
      if (!eom[k]) {
        eom[k] = [];
      }
      eom[k].push(doc);
    }
    if (doc.childNodes && doc.childNodes.length && !hasRepeat) {
      Array.prototype.forEach.call(doc.childNodes, function(child) {
        trans(reg, child, scope, key, eom);
      });
    }
  }

  return repeat;
});

define('grammer.scope', function() {

  var me = this;
  var model = me.need('core.model');
  var tools = me.need('core.tools');

  function _scope(str) {
    this.node.removeAttribute('scope');
    var source = me.need(str);
    if (tools.isObject(source)) {
      source.watch(this.eom);
      this.scope = source;
    }else if(tools.isFunction(source)){
      var m = new model();
      this.scope = m;
      source.call(m);
      m.watch(this.eom);
    }
  }


  return _scope;
});

define('core.model', function() {

  var tools = this.need('core.tools');

  var _eom, last = {};

  var isArray = tools.isArray;
  var isObject = tools.isObject;
  var isString = tools.isString;
  var isNumber = tools.isNumber;
  var each = tools.each;
  var loop = tools.loop;

  function update(value, key, eom) {
    if (isString(value) || isNumber(value)) {
      loop(eom[key], function(ele, i) {
        ele.nodeValue = value;
      });
    } else if (isArray(value)) {
      loop(value, function(item, index) {
        update(item, index, eom[key][index]);
      });
    } else if (isObject(value)) {
      each(value, function(item, index) {
        update(item, index, eom);
      });
    }
  }

  function Model(ref) {
    for (var x in ref) {
      this[x] = ref[x];
      last[x] = ref[x];
    }
  }

  Model.prototype.apply = function() {
    each(this, function(item, index) {
      if (_eom[index] && last[index] !== item) {
        update(item, index, _eom);
        last[index] = item;
      }
    });
  };

  Model.prototype.watch = function(eom, repeat) {
    _eom = eom;
  };

  Model.prototype.inject = function(source) {
    var me = this;
    each(source, function(item, index) {
      me[index] = source[index];
    });
  };

  return Model;
});

define('core.tools', function() {
  var tools = {
    /**
     * it's for array loop
     */
    loop: function(array, fn) {
      var context = {};
      for (var i = 0; i < array.length; i++) {
        fn.call(context, array[i], i);
      }
    },
    /**
     * it's for object loop,but will not loop in prototype
     */
    each: function(obj, fn) {
      var context = {};
      for (var x in obj) {
        if(obj.hasOwnProperty && obj.hasOwnProperty(x)){
          fn.call(context, obj[x], x);
        }
      }
    },
    log: function() {
      if(console){
        Function.apply.call(console.log, console, arguments);
      }
    },
    isArray: function(array) {
      return toString.apply(array) === '[object Array]';
    },
    isObject: function(obj) {
      return obj !== null && typeof obj === 'object';
    },
    isFunction: function(obj) {
      return typeof obj === 'function';
    },
    isString: function(str){
      return typeof str === 'string';
    },
    isNumber: function(no){
      return typeof no === 'number';
    }
  };

  return tools;
});
