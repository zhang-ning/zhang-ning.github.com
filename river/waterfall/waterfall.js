function waterfall (container, cssClass) {
	container = "cards-div";
	cssClass = "sf-card-div";
	if(typeof container === "string"){
		container = document.getElementById(container);
	}
	
	var	cards = container.querySelectorAll("." + cssClass);
	var columns = [];
	var sizes = [];
	var MARGIN_LEFT = 30;
	var MARGIN_TOP = 30;
	var ALLOW_TALL_GAP = MARGIN_TOP * 1.5;
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
	var PROCCESSED_INDEX = 0;
	placeAt(columns, dataQueue);
	console.log(sizes);
	console.log(waitingQueue);
	console.log(columns);
	document.getElementById("waiting-queue").textContent =  waitingQueue.toString();

	function placeAt (columns, queue) {
		var item = queue.current();
		var i = insertable(columns, item.size);
		if(i === null){
			var choice = refindInsertable(columns, item.size);
			columns = choice.columns;
			i = choice.columnI;
			console.log("refind ", i , item.card.textContent, PROCCESSED_INDEX);
		}
		if( i !== null){
			placeCard(item.card, getColumnPos(columns, i));
			splitColumns(columns, i, item.size);
			setContainerHeight(container, columns);
			if(waitingQueue.length() > 0){
				var found = findInsertable(waitingQueue.data, columns);
				while(found !== null){
					item = waitingQueue.remove(found.queueI);
					placeCard(item.card, getColumnPos(columns, found.columnI));
					splitColumns(columns, found.columnI, item.size);
					setContainerHeight(container, columns);
					found = findInsertable(waitingQueue.data, columns);
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
		var span = document.createElement("span");
		span.textContent = PROCCESSED_INDEX++;
		span.style.marginLeft = "20px";
		span.style.color = "red";
		span.style.position = "absolute";
		span.style.left = "0px";
		span.style.top = "0px";
		card.appendChild(span);

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
		//mergeSimilarTallColumns(columns);
		//console.log(columns);
	}
	function mergeColumns (columns){
		var i = 0;
		var len = columns.length;
		while(i < len - 2){
			if( Math.abs(columns[i].height - columns[i + 1].height) < ALLOW_TALL_GAP ){
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
	function mergeSimilarTallColumns (columns) {
		
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
		var mergedArea = columns[k].width * Math.abs((columns[j].height - columns[k].height));
		columns[j].width += columns[k].width;
		columns[j].height = columns[j].height > columns[k].height ? columns[j].height : columns[k].height; 
		for(var i = k, len = columns.length - 1; i < len; i++){
			columns[i] = columns[i + 1];
		}
		columns.length--;
		return mergedArea;
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
	function refindInsertable (columns, item) {
		console.log(JSON.stringify(columns));
		var choices = [];
		var i = 0;
		var choice;
		while(i < columns.length){
			choice = mergeChoice(cloneColumns(columns), item, i);
			choices.push(choice);
			i++;
		}

		var it = pickSmallestOne(choices, function(one, two){
			if(one.mergedArea < two.mergedArea){
				return -1;
			}else if(one.mergedArea === two.mergedArea){
				return 0;
			}else{
				return 1;
			}
		});

		choice = choices[it];
		columns = choice.columns;
		return choice;
	}

	function mergeChoice (columns, item, i){
			var mergedArea = 0;
			//var i = findLowest(columns);
			var width = columns[i].width;
			var k = i + 1;
			var j = i - 1;
			var len = columns.length;
			while((k < len || j >= 0) && width < item.width ){
				if( k < len && j >=0 && columns[k].height < columns[j].height){
					width += columns[k].width;
					mergedArea += mergeAColumn(columns, i);
					len--;
				}else if(k < len && j >=0 && columns[k].height >= columns[j].height){
					width += columns[j].width;
					mergedArea += mergeAColumn(columns, i - 1);
					len--;
					i--;
					j--;
					k--;
				}else if(j < 0 && k < len){
					width += columns[k].width;
					mergedArea += mergeAColumn(columns, i);
					len--;
				}else if(k >= len && j >= 0){
					width += columns[j].width;
					mergedArea += mergeAColumn(columns, i - 1);
					len--;
					i--;
					j--;
					k--;
				}
			}
			console.log(JSON.stringify(columns));
			var columnI = insertable(columns, item);
			return { columnI: columnI, mergedArea: mergedArea, columns: columns };	
	}

	function cloneColumns (columns) {
		var copies = [];
		for(var i = 0, len = columns.length; i < len; i++){
			var copy = {};
			var column = columns[i];
			for(var p in column){
				copy[p] = column[p];
			}
			copies.push(copy);
		}
		return copies;
	}
	function findInsertable (queue, columns) {
		for(var i = 0, len = queue.length; i < len; i++){
			var j = insertable(columns, queue[i].size);
			if(j !== null){
				return {queueI: i, columnI: j};
			}
		}
		return null;
	}
	function findLowest (columns) {
		var lowest = 0;
		for(var i = 1, len = columns.length; i < len; i++){
			if(columns[i].height < columns[lowest].height){
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
	function pickSmallestOne (items, func) {
		var it = 0;
		for(var i = 1, len = items.length; i < len; i++){
			var smaller = func(items[i], items[it]);
			if(smaller < 0){
				it = i;
			}
		}
		return it;
	}
	function setContainerHeight (container, columns){
		container.style.height = columns[findTallest(columns) ].height + "px";
	}

	
}
