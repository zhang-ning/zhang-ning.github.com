function waterfall (container, cssClass) {
	container = "cards-div";
	cssClass = "sf-card-div";
	if(typeof container === "string"){
		container = document.getElementById(container);
	}
	
	var	cards = container.querySelectorAll("." + cssClass);
	var columns = [];
	var sizes = [];
	var MARGIN_LEFT = 20;
	var MARGIN_TOP = 20;
	var containerWidth = Utils.getPxNum( Utils.getStyle(container).getPropertyValue("width") );
	console.log(containerWidth);
	for(var i = 0, len = cards.length; i < len; i++){
		var cstyle = Utils.getStyle(cards[i]);
		var width = Utils.getPxNum(cstyle.getPropertyValue("width")) + MARGIN_LEFT;
		var height = Utils.getPxNum(cstyle.getPropertyValue("height")) + MARGIN_TOP;
		var size = { size: {width: width, height: height},
					 card: cards[i]
					};
		sizes.push(size);
		//console.log(size);
	}

	columns.push({width: containerWidth, height: 0});
	var dataQueue = new Queue(sizes);
	var waitingQueue = new Queue();
	var NARROWEST_WIDTH = findNarrowestWidth(sizes);
	placeAt(columns, dataQueue);
	console.log(sizes);
	console.log(waitingQueue);
	console.log(columns);

	function placeAt (columns, queue) {
		var item = queue.current();
		var i = insertable(columns, item.size);
		if( i !== null){
			placeCard(item.card, getColumnPos(columns, i));
			splitColumns(columns, i, item.size);
			setContainerHeight(container, columns);
			if(waitingQueue.length() > 0){
				var j = findInsertable(waitingQueue.data, columns);
				while(j !== null){
					item = waitingQueue.remove[j];
					placeCard(item.card, getColumnPos(columns, i));
					splitColumns(columns, item.size);
					setContainerHeight(container, columns);
					j = findInsertable(waitingQueue.data, columns);
				}
			}
			if(queue.hasNext()){
				queue.moveNext();
				placeAt(columns, queue);
			}
		}else{
			waitingQueue.push(item);
			if(queue.hasNext()){
				queue.moveNext();
				placeAt(columns, queue);
			}
		}
	}

	function placeCard(card, pos) {
		card.style.position = "absolute";
		card.style.left = pos.left + "px";
		card.style.top = pos.top + "px";
		card.style.visibility = "visible";
	}

	function splitColumns (columns, i, item) {//TBD
		if(columns[i].width > item.width){
			for(var j = columns.length; j > i + 1; j--){
				columns[j] = columns[j - 1];
			}
			columns[i + 1] = { width: columns[i].width - item.width, height: columns[i].height };
			columns[i] = { width: item.width, height: columns[i].height + item.height };
		}else{
			columns[i].height += item.height;
		}
		mergeColumns(columns);
		mergeNarrowColumns(columns);
		console.log(columns);
	}
	function mergeColumns (columns){
		var i = 0;
		var len = columns.length;
		while(i < len - 2){
			if(columns[i].height === columns[i + 1].height){
				columns[i].width += columns[i + 1].width;
				for(var j = i + 2; j < len; j++){
					columns[j - 1] = columns[j];
				}
				columns.length = --len;
			}else{
				i++;
			}
		}
		return columns;
	}

	function mergeNarrowColumns (columns) {
		// 0 ~ n - 1
		var i = 1;
		var len = columns.length - 1;
		while(i < len){
			if(columns[i].width < NARROWEST_WIDTH){
				if( Math.abs(columns[i].height - columns[i - 1].height) <= Math.abs( columns[i].height - columns[i + 1].height ) ){
					mergeAColumn(columns, i - 1);
				}else{
					mergeAColumn(columns, i);
				}
				len--;
			}else{
				i++;
			}
		}

		// 0
		// n
		var last = columns.length - 1;
		if(last > 0 && columns[last].width < NARROWEST_WIDTH){
			mergeAColumn(columns, last - 1);
		}
	}
	function mergeAColumn (columns, j) {
		var k = j + 1;
		columns[j].width += columns[k].width;
		columns[j].height = columns[j].height > columns[k].height ? columns[j].height : columns[k].height; 
		for(var i = k, len = columns.length - 1; i < len; i++){
			columns[i] = columns[i + 1];
		}
		columns.length--;
	}

	function insertable(columns, item){
		var it = null;
		for(var i = 0, len = columns.length; i < len; i++){
			if( columns[i].width >= item.width ){
				if(it !== null){
					if(columns[i].height < columns[it].height){
						it = i;
					}
				}else{
					it = i;
				}
			}
		}
		return it;
	}
	function findInsertable (queue, columns) {
		for(var i = 0, len = queue.length; i < len; i++){
			var j = insertable(columns, queue[i]);
			if(j !== null){
				return j;
			}
		}
		return null;
	}
	function findLowest (columns) {
		var lowest = 0;
		for(var i = 0, len = columns.length; i < len; i++){
			if(columns[i].height < lowest){
				lowest = i;
			}
		}
		return lowest;
	}
	function findTallest (columns){
		var tallest = 0;
		for(var i = 1, len = columns.length; i < len; i++){
			if(columns[i].height > columns[tallest].height){
				tallest = i;
			}
		}
		return tallest;
	}
	function getColumnPos (columns, i) {
		var width = 0;
		var j = 0;
		while(j < i){
			width += columns[j++].width
		}
		return { left: width + MARGIN_LEFT, top: columns[i].height + MARGIN_TOP };
	}
	function findNarrowestWidth (sizes){
		var it = 0;
		for(var i = 1, len = sizes.length; i < len; i++){
			if(sizes[i].size.width < sizes[it].size.width){
				it = i;
			}
		}
		return sizes[it].size.width;
	}
	function setContainerHeight (container, columns){
		container.style.height = columns[findTallest(columns) ].height + "px";
	}
	
}
