function Utils(){

}
	Utils.bindEvent = function(target, type, handler){//, capture
		if(target.addEventListener){
			target.addEventListener(type, handler);
		}else{
			target.attachEvent("on" + type, handler);
		}
	}

	Utils.unbindEvent = function(target, type, handler){
		if(target.removeEventListener){
			target.removeEventListener(type, handler);
		}else{
			target.detachEvent("on" + type, handler);
		}
	}


	Utils.getStyle = function (target){
		if(window.getComputedStyle){
			return window.getComputedStyle(target, null);
		}else{
			return target.currentStyle;
		}
	}

	Utils.isFireFox = /firefox/i.test(window.navigator.userAgent);

	//TBD River defects here
	Utils.getAvailableHeight = function(containerH, container, self){
		var cstyle = Utils.getStyle(container);
		var height = 0;
		//var containerH = Utils.getPxNum(cstyle.height);

		//the first child
		var node = container.firstChild,
			margin1 = 0,
			margin2 = 0;
		while(node ){
			if(node.nodeType === Node.ELEMENT_NODE){
				//node.style.border = "1px solid red";
				cstyle = Utils.getStyle(node);
				height = Utils.getPxNum(cstyle.marginTop) + Utils.getPxNum(cstyle.borderTopWidth) + Utils.getPxNum(cstyle.paddingTop) + Utils.getPxNum(cstyle.height) + Utils.getPxNum(cstyle.paddingBottom) + Utils.getPxNum(cstyle.borderBottomWidth);				
				margin1 = Utils.getPxNum(cstyle.marginBottom);
				break;
			}else{
				node = node.nextSibling;
			}
		}

		node = node.nextSibling;
		while(node){
			if(node.nodeType === Node.ELEMENT_NODE){
				//node.style.border = "1px solid blue";
				cstyle = Utils.getStyle(node);
				margin2 = Utils.getPxNum(cstyle.marginTop);
				height += margin1 > margin2 ? margin1 : margin2;
				margin1 = Utils.getPxNum(cstyle.marginBottom) 

				height += Utils.getPxNum(cstyle.borderTopWidth) + Utils.getPxNum(cstyle.paddingTop) + Utils.getPxNum(cstyle.height) + Utils.getPxNum(cstyle.paddingBottom) + Utils.getPxNum(cstyle.borderBottomWidth);
			}
			node = node.nextSibling;
		}

		//last Node margin-bottom
		height += margin1;

		if(self){
			cstyle = Utils.getStyle(self);
			height -= Utils.getPxNum(cstyle.height);
		}
		return  containerH - height;

	}
	Utils.getPxNum = function(px){
		return Number(px.replace(/px$/, ''));
	}

	Utils.addClass = function(elm, aclass){
        var classV = elm.getAttribute("class");
        if(!classV){
        	elm.setAttribute("class", aclass);
        }else if(classV.indexOf(aclass) < 0){
          classV = classV + " " + aclass;
          elm.setAttribute("class", classV);
        }
	}

	Utils.removeClass = function(elm, aclass){
        var classV = elm.getAttribute("class");
        if(classV){//.indexOf(aclass) >= 0
          classV = classV.replace(aclass, "");
          elm.setAttribute("class", classV);
        }
	}

	Utils.hasClass = function(elm, aclass){
        var classV = elm.getAttribute("class");
        if(classV && classV.indexOf(aclass) >= 0){
          return elm;
        }
	}

	Utils.isChildOf = function(theParent, child, maxLevel){
		var parent = child.parentNode;
		var i = 0;
		while(parent && i < maxLevel){
		  if(parent === theParent){
		    return true;
		  }
		  parent = parent.parentNode;
		  i++;
		}
		return false;
	}

	Utils.findChildOfClass = function(node, className){
		var child = node.firstChild;
		while(child){
		  //console.log(child);
		  if(child.nodeType === 1){
		    var aclass = child.getAttribute("class");
		    if(aclass && aclass.indexOf(className) >= 0){
		      return child;
		    }
		  }
		  child = child.nextSibling;
		}
	}

	Utils.findAncestorOfClass = function(node, className, maxLevel){
		var parent = node.parentNode;
		var i = 0;
		while(parent && i < maxLevel){
		  if(Utils.hasClass(parent, "nav-item")){
		    return parent;
		  }
		  parent = parent.parentNode;
		  i++;
		}
		return null;
	}

	Utils.trim = function(str) {
		return str.replace(/^\s*/, "").replace(/\s*$/, "");
	}
