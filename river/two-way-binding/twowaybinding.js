/* 
 * all rights resorved by hunter.dding@gmail.com @猎人丁丁's wife'
 * the Gloable variable may presents , Resume, main, define
 * the create method is for define a group of feature in one module
 * and the run method is just for run your app like the main entrance of what other language do
 *
 */

  var reg = /^\s*{{\s*|\s*}}\s*$/g;

  var clearIt = function(str){
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
  }
  var repeat = function(node,expression){//,scope
    try{
      var template = node.cloneNode(true);
      template.removeAttribute("repeat");

      expression = expression.replace(reg,'');
      var parts = expression.split("in");
      var key = lookupPath(clearIt(parts[1]));
      var value = lookupScope(clearIt(parts[1]), key );
      value.forEach(function(item, i){
        trace[clearIt(parts[0])] = item;
        pathes[clearIt(parts[0])] = key.join(".")+"["+i+"]";
        pathes[clearIt(parts[1])] = key.join(".");

        var newer = template.cloneNode(true);
        scan(newer, item);
        node.parentNode.insertBefore(newer, node);

        delete trace[clearIt(parts[0])];
      });
      node.parentNode.removeChild(node);
    }catch(e){
          console.log(e);
    }
  }

  var translate = function(node, str){//scope
    if(reg.test(str)){
      var result = clearIt( str.replace(reg,'') );
      var key = lookupPath(result);
      node.nodeValue = lookupScope(result, key);

      setPath(node.parentNode, key);
    }
  };
  var translateAttr = function(attr, node){//scope
    var str = attr.value;
    if(attr.name =="value" && reg.test(str)){
      var result = clearIt( str.replace(reg,'') );
      var key = lookupPath(result);
      var value = lookupScope(result, key);
      attr.value = value;
    }

    setPath(node, key);
  };

  var setPath = function(node, key){
    if(!key){return;}//TBD
    var str = key.join(".");
    node.setAttribute("modal", str);
    if(!keys[str]){
      keys[str] = [];
    }
    keys[str].push(node);
  }

  var lookupPath = function(exp){
    var dots = exp.split(".");
    var len = dots.length;
    var path = [];
    var p = /\[(.*)\]/;
    var i = 0;
    while(i < len){
      var finds = dots[i].match(p);
      if(finds && finds.length == 3){
        path.push( pathes[finds[1]] ? (pathes[finds[1]] + "[" + finds[2] +"]") : dots[i]);
      }else{
        path.push( pathes[dots[i]] ? pathes[dots[i]] : dots[i] );
      }
      i++;
    } 
    return path;
  }

  var lookupScope = function(result){
    var scope = rootScope;
    var p = /(.*)\[(.*)\]/;
    var path = result.split(".");

    if(path.length > 0){
      var i = 0;
      var len = path.length;
      while(i < len){
        var finds = path[i].match(p);
        if(finds && finds.length == 3){
          scope = scope[ finds[1] ][finds[2]] ;
        }else{
          scope = scope[ path[i] ];
        }
        i++;
      }
      return scope;
    }
  }


  var lookupScope2 = function(result, value){
    //return namespace ? trace[namespace] : rootScope;
    var scope = rootScope;
    var p = /(.*)\[(.*)\]/;
    var path = result.split(".");

    if(path.length > 0){
      var i = 0;
      var len = path.length;
      while(i < len-1){
        var finds = path[i].match(p);
        if(finds && finds.length == 3){
          scope = scope[ finds[1] ][finds[2]] ;
        }else{
          scope = scope[ path[i] ];
        }
        i++;
      }

        var finds = path[i].match(p);
        if(finds && finds.length == 3){
          scope[ finds[1] ][finds[2]] = value;
        }else{
          scope[ path[i] ] = value;
        }
    }
  }

  var scan = function(node){//, scope
        if(node.attributes && node.attributes.length){
          if(node.getAttribute("repeat")){
            repeat(node, node.getAttribute("repeat"));//, scope
            return;
          }
          Array.prototype.forEach.call(
            node.attributes, function(attr){
              translateAttr(attr, node);
            }
          );
        }

        if("#text" === node.nodeName){
          translate(node, node.nodeValue);
        }else if(node.childNodes && node.childNodes.length){
          Array.prototype.forEach.call(node.childNodes, function(child){
            scan(child);//, scope
          });
        }
      
      return;
    }

  var start = function(cn, dom){
    rootScope = cn;
    trace = cn;
<<<<<<< HEAD
    scan(dom); //,rootScope
=======
    scan(document.body); //,rootScope
>>>>>>> 5bb0f26d0b2845ef2eb91176b2adabe62271ff69
  }
  var rootScope;// = resume;
  var trace;//TBD
  var pathes = {};
  var keys = {};

  document.addEventListener("keyup", function(e){
    var target = e.target;console.log(target.type);
    var modal = target.getAttribute("modal");
      var friends = keys[modal];
      for(var i = 0; i<friends.length; i++){
        var node = friends[i];
        if(node != target){
    if(target.type == "text"){
      var modal = target.getAttribute("modal");
          if(node.type == "text"){
            node.value = target.value;
          }else{
            node.textContent = target.value;
          }
          lookupScope2(modal, target.value);
        }
      }
    }
  });

<<<<<<< HEAD
 var default_binding = {
    "title" : "The Seasons",
    "description" : "",
    "seasons" : [
      {title: "Spring", features: [ "flower"]},
      {title: "Summer", features: ["hot", "swimming", "spirit"]},
      {title: "Autum", features: [ "moon cake", "fruits"]},
      {title: "Winter", features: [ "snow"]}
    ]
  };

  function demoTwowaybinding(data, div){
    start(data, div);
  }
=======
>>>>>>> 5bb0f26d0b2845ef2eb91176b2adabe62271ff69
