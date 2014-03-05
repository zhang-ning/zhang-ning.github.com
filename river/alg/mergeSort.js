function mergeSort(a, start, end, records){
	//console.log(start, end, output(a, start, end));
	output(a, start, end)
	records.push(["dividing", start, end]);
	if(end > start){
		if(end > start + 1){
			var half =  Math.ceil( (end - start + 1)/2 );
			mergeSort(a, start, start + half - 1, records);
			mergeSort(a, start + half, end, records);
		}
		merge(a, start, end, records);
	}
}
function merge(a, start, end, records){
	//console.log("merge...." + start + " " + end);
	//output(a, start, end);
	var steps = [];
	var half =  Math.ceil( (end - start + 1)/2 );
	var temp = new Array(end - start + 1);
	
	var left = start;
	var right = start + half;
	var step;
	var i = start;
	for(; i <= end; i++){
		step = a[left] > a[right] ? right++ : left++;
		temp[i-start] = a[step];
		//temp[i-start] = a[left] > a[right] ? a[right++] : a[left++];
		steps.push(step);
		if(left > start + half - 1 && right <= end){ //left has been empty
			i++;
			for(; right <= end; i++){
				step = right++;
				temp[i-start] = a[step];
				//temp[i-start] = a[right++];
				steps.push(step);
			}
			break;
		}
		if(right > end && left <= start + half - 1){//righ has been empty
			i++
			for(; left <= start + half -1; i++){
				step = left++;
				temp[i - start] = a[step];
				//temp[i - start] = a[left++];
				steps.push(step);
			}
			break;
		}
	}
	records.push(["merging", start, end, steps]);
	//console.log(temp);
	//console.log(temp);
	for(i = 0; i <= end - start; i++ ){//start <= end; start++
		a[start + i] = temp[i];
	}
	//console.log(a);
}

function migrating (bars, records, line, current, step ) {//start, end, steps, step
	var start = records[current][1];
	var end = records[current][2];
	var steps = records[current][3];

	var one = bars[ steps[step] ];
	var distance = (steps[step] - step - start) * (createBars.W + createBars.GAP);

	var direction1 = distance > 0 ? -1 : 1;
	distance =  Math.abs(distance);
	//var total = Math.ceil( distance / exchanging.PIECE );
	//
	var total = Math.ceil( exchanging.DISTANCEY / exchanging.PIECE );
	//var PIECEY = Math.floor(exchanging.DISTANCEY / total);// (exchanging.DISTANCEY % total) > 0 ? (Math.floor(exchanging.DISTANCEY/total)) : (exchanging.DISTANCEY/total);
	var PIECEX = Math.floor( distance / exchanging.DISTANCEY * exchanging.PIECE );


	moving(one, total, direction1, 0 );

	function moving(it, total, direction, index) {
		var count = 1;
		var intervalRef = setInterval(function(){
			//console.log("moving...");
			if(count < total){
				move(it, it.pos.x + PIECEX * count * direction, it.pos.y + count * exchanging.PIECE);
			}else if(count === total){
				it.pos.x = it.pos.x + distance * direction;
				move(it, it.pos.x, it.pos.y + exchanging.DISTANCEY);
			}
			count++;
			if(count > total){
				clearInterval(intervalRef);
				if(step < steps.length - 1){
					setTimeout(function() {
						migrating(bars, records, line, current, ++step);
					}, exchanging.GAP_DONE );
				}else{
					setTimeout(function() {
						var backups = [];
						for(var i = 0; i <= steps.length - 1; i++){
							backups[i] = bars[steps[i]];
						}
						for(var j = start, i = 0; j <= end; j++){
							bars[j] = backups[i++];
							move(bars[j], bars[j].pos.x, bars[j].pos.y);
						}
						
						if(++current < records.length){
							setTimeout(function() {
								playMergeSort(bars, records, line, current);
							}, exchanging.GAP_DONE);
						}else{
							sortDone();
						}

					} , exchanging.GAP_MOVING);
				}
			}
		}, exchanging.GAP_MOVING);
	}

	function move(it, gap, y){
		it.elm.setAttribute("d", drawer.barPath(gap, y, it.pos.w, it.pos.h));
	}
}

function merging(bars, records, line, current) {
	migrating(bars, records, line, current, 0); // start, end, steps, 0
}

function playMergeSort(bars, records, line, current){//console.log("current", current);
	updateLine(line, records[current][1], records[current][2]);
	if(records[current][0] === "dividing"){//dividing
		if(++current < records.length){
			setTimeout(function(){
				playMergeSort(bars, records, line, current);
			}, exchanging.GAP_DONE);
		}
	}else{//merging
		merging(bars, records, line, current);
	}
}

function scopeLine(g) {
	var line = drawer.createLine(2, "red");
	g.appendChild(line);
	return line;
}

function updateLine(line, start, end) {
	var x1 = createBars.X + start * (createBars.W + createBars.GAP) + createBars.GAP;
	var x2 = createBars.X + end * (createBars.W + createBars.GAP) + createBars.GAP + createBars.W;
	var y1 = createBars.Y + 1;
	//console.log(x1, x2);
	drawer.updateLine(line, x1, y1, x2, y1);
}

function virtualizeMergeSort(a){
	//console.log("virtualizeMergeSort....");
	var g = document.getElementById("main_g");
	drawer.clearSvg(g);
	var bars = createBars(a, g);
	var records = [];
	mergeSort(a, 0, a.length - 1, records);
	//console.log(a);
	//console.log(records);

	//console.log(records.length);
	playMergeSort(bars, records, scopeLine(g), 0);
}