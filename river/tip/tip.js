function tipTrace(cx, cy, width){
		var r = 10;//radsiu
		var h = 40;//height
		var w = 120;//width
		var dx = 10;//trigle width
		var dy = 10;//trigle height
		var d ;

		var diffD = 0, 
			diffR = 0,
			diffW = 0;

		var tx = cx,
			ty = cy - dy - r - 1/2*h,
			hF = 1;


		var left = cx = Number(cx);
		var top = cy = Number(cy);

		if(top > (h + dy + 2*r) ){//top
			if((width - left) < (r + dx + 1/2*w)){
				left = (width - left);
				hF = 2;
			}//right
		}else{//below
			hF = 3;
			if((width - left) < (r + dx + 1/2*w)){//right
				left = (width - left);
				hF = 4;
			}
		}

		if(left < (r + dx + 1/2*w) ){
			if( left > (dx + r) ){
				diffW = 1/2*w - (left - dx - r);
			}else if(left >= dx){
				diffR = r - (left - dx);
				diffW = 1/2*w;
			}else{
				diffD = dx - left;
				diffR = r;
				diffW = 1/2*w;
			}
		}

		if(hF === 1){
			tx = cx + (diffW + diffD + diffR);
			ty = cy - (dy + r + 1/2*h);
			d = "M "+cx+","+cy+" l -"+(dx - diffD)+",-"+dy+" -" + (1/2*w - diffW) + ",0 q -" + (r - diffR) + ",0 -" + (r - diffR) + ",-" + (r - diffR) + " l 0,-" + (h + diffR) + " q 0, -" + r + " " + r + ",-" + r + " l " + (w + 2*dx) + ",0 q " + r + ",0 " + r + "," + r + " l 0," + h + " q 0," + r + " -" + r + "," + r + " l -" + (1/2*w + diffW + diffR + diffD) + ",0 Z";
		}else if(hF === 2){
			tx = cx - (diffW + diffD + diffR);
			ty = cy - (dy + r + 1/2*h);
			d = "M "+cx+","+cy+" l -"+(dx + diffD)+",-"+dy+" -" + (1/2*w + diffW + diffD + diffR) + ",0 q -" + r + ",0 -" + r + ",-" + r + " l 0,-" + h + " q 0, -" + r + " " + r + ",-" + r + " l " + (w + 2*dx) + ",0 q " + r + ",0 " + r + "," + r + " l 0," + (h+diffR) + " q 0," + (r - diffR) + " -" + (r - diffR) + "," + (r - diffR) + " l -" + (1/2*w - diffW) + ",0 Z";
		}else if(hF === 3){
			tx = cx + (diffW + diffD + diffR);
			ty = cy + (dy + r + 1/2*h);
			d = "M "+cx+","+cy+" l -"+(dx - diffD)+","+dy+" -" + (1/2*w - diffW) + ",0 q -" + (r - diffR) + ",0 -" + (r - diffR) + "," + (r - diffR) + " l 0," + (h + diffR) + " q 0, " + r + " " + r + "," + r + " l " + (w + 2*dx) + ",0 q " + r + ",0 " + r + ",-" + r + " l 0,-" + h + " q 0,-" + r + " -" + r + ",-" + r + " l -" + (1/2*w + diffW + diffR + diffD) + ",0 Z";
		}else if(hF === 4){
			tx = cx - (diffW + diffD + diffR);
			ty = cy + (dy + r + 1/2*h);
			d = "M "+cx+","+cy+" l -"+(dx + diffD)+","+dy+" -" + (1/2*w + diffW + diffD + diffR) + ",0 q -" + r + ",0 -" + r + "," + r + " l 0," + h + " q 0, " + r + " " + r + "," + r + " l " + (w + 2*dx) + ",0 q " + r + ",0 " + r + ",-" + r + " l 0,-" + (h+diffR) + " q 0,-" + (r - diffR) + " -" + (r - diffR) + ",-" + (r - diffR) + " l -" + (1/2*w - diffW) + ",0 Z";
		}

		return {
			d:d,
			tx:tx,
			ty:ty
		};
	}