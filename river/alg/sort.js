function quickSort(a, start, end, records) {
	var it = partition(a, start, end, records);
	//console.log("----" + it + "---" + a[it]);
	if(it > (start + 1)){
		quickSort(a, start, it - 1, records);
	}
	if(it < (end - 1)){
		quickSort(a, it + 1, end, records);
	}
}
function partition(a, start, end, records){
	if(start > end) return;

	var it = start - 1;
	var j = start;
	while(j < end){
		if(a[j] <= a[end]){
			(++it !== j) && exchange(a, it, j, records);
			output(a, start, end);
		}
		j++
	}
	( ++it !== end) && exchange(a, it, end, records);
	output(a, start, end);
	return it;
}

function exchange(a, i, j, records) {
	var temp = a[i];
	a[i] = a[j];
	a[j] = temp;

	records.push([i, j]);
}

/*function mergeSort(a, start, end){
	console.log(start, end, output(a, start, end));
	if(end > start){
		if(end > start + 1){
			var half =  Math.ceil( (end - start + 1)/2 );
			mergeSort(a, start, start + half - 1);
			mergeSort(a, start + half, end);
		}
		merge(a, start, end);
	}
}
function merge(a, start, end){
	console.log("merge...." + start + " " + end);
	//output(a, start, end);
	var half =  Math.ceil( (end - start + 1)/2 );
	var temp = new Array(end - start + 1);
	
	var left = start;
	var right = start + half;
	var i = start;
	for(; i <= end; i++){
		temp[i-start] = a[left] > a[right] ? a[right++] : a[left++];
		if(left > start + half - 1 && right <= end){ //left has been empty
			i++;
			for(; right <= end; i++){
				temp[i-start] = a[right++];
			}
			break;
		}
		if(right > end && left <= start + half - 1){//righ has been empty
			i++
			for(; left <= start + half -1; i++){
				temp[i - start] = a[left++];
			}
			break;
		}
	}
	//console.log(temp);
	for(i = 0; start <= end; start++){
		a[start] = temp[i++];
	}
	console.log(a);
}*/

function bubbleSort(a, records){
	for(var i = 0, len = a.length; i < len; i++){
		for(var j = a.length - 1; j > i; j--){
			if(a[j] < a[j - 1]){
				exchange(a, j-1, j, records);
				//console.log(a);
			}
		}
	}
}

function output(a, start, end){
	var part = [];
	while(start <= end){
		part.push(a[start++]);
	}
	//console.log(part);
	return part.join(',')
}

function demoQuickSort(a){
	//console.log("quickSort....");
	//console.log(a);
	var records = [];
	quickSort(a, 0, a.length - 1, records);
	return records;
}
function demoMergeSort(a){
	//console.log("mergeSort....");
	//console.log(a);
	mergeSort(a, 0, a.length - 1);
}
function demoBubbleSort(a){
	//console.log(a);
	var records = [];
	bubbleSort(a, records);
	return records;
}
function demoAlg(){
	var a = [5, 4, 9, 2, 1, 8, 6, 3, 7];
	demoQuickSort(a);
	demoMergeSort(a);
	demoBubbleSort(a);
}
