{
	'use strict'
	function drawamida(){
	const canvas = document.getElementById('canvas');
	if (!canvas.getContext || !canvas){
		return;
	}
	const ctx = canvas.getContext('2d');

	const w = document.getElementById('content').clientWidth;
	const h = document.getElementById('content').clientHeight;
	const mainwidth = document.getElementById('clientwidth').clientWidth;

	canvas.width = w -10; //canvasはbox-sizing合わせてくれないのでこっちで合わせる
	canvas.height = h - 10;

	const treesize = 17;
	const height = 20;
	const lineStart = 40;
	const precontainer = [];
	let sufcontainer = [];
	let sufcontainer2 = [];
	let prefix_id,suffix_id,words;
					let red = [];

	function random(){
		return Math.floor(Math.random() * 2);
	}

	function spliteByLength(str, length){ //入力された文字列を３文字ごとに改行します
		const resultArr = [];
		let index = 0;
		let start = 0;
		let end = length;
		while (start < str.length){
			resultArr[index] = str.substring(start, end);
			index++;
			start = end;
			end = start + length;
		}
		return resultArr;
	}

	const amida = function(tree){

		ctx.clearRect(0,0,canvas.width,	canvas.height);
		ctx.strokeStyle = 'black';

		for (let x = 1; x <= tree; x++){
			prefix_id = 'prefix_' + x
			precontainer[x-1] = document.getElementById(prefix_id).value;
		}

		for (let x = 1; x <= tree; x++){
			ctx.font = "bold 15px 'Avenir'";
			ctx.textAlign = 'center';
			words = precontainer[x-1];
			words = spliteByLength(words, 3);
			for (let y = 0; y < words.length && y < 2; y++){
				if ((tree < 10) && ( mainwidth < 600 )){
					ctx.fillText(words[y], 50 * x, 25 + 15 * y);
				} else {
					ctx.fillText(words[y], (canvas.width / (tree + 1)) * x, 25 + 15 * y);
				}
			}
		}

		sufcontainer2 = [];

		for (let x = 1; x <= tree; x++){
			suffix_id = 'suffix_' + x
			sufcontainer[x-1] = document.getElementById(suffix_id).value;
		}

		for(let x = 0; x < sufcontainer.length; x++){
			sufcontainer2[x] = sufcontainer[x];
		}

		for (let i = sufcontainer2.length - 1; i > 0; i--){  //ここでsuf配列をシャッフルします
			let r = Math.floor(Math.random() * (i + 1));
			let tmp = sufcontainer2[i];
			sufcontainer2[i] = sufcontainer2[r];
			sufcontainer2[r] = tmp //iとrの値を交換してる(Fisher-Yates shuffle)
		}

		for (let x = 1; x <= tree; x++){
			ctx.font = "bold 15px 'Avenir'";
			ctx.textAlign = 'center';
			words = sufcontainer2[x-1];
			words = spliteByLength(words, 3);
			for (let y = 0; y < words.length; y++){
				if ((tree < 10) && ( mainwidth < 600 )){
					ctx.fillText(words[y], 50 * x, 425 + 15 * y);
				} else {
					ctx.fillText(words[y],(canvas.width / (tree + 1)) * x, 425 + 15 * y);
				}
			}
		}

		ctx.strokeStyle = "#6e6e6e"
										let liten ;
		for (let y = 1; y <= treesize; y++){ //忘れがちだけどこれは横一列に描画してる
													liten = 0;
													red[y-1] = [liten];
			for (let x = 1; x <= tree; x++){
				ctx.lineWidth = 2;
				if (x === tree || random() === 0 || y === treesize){
										red[y-1][liten] = [0,0,0];
										liten++;
					ctx.beginPath();
					if ((tree < 10) && ( mainwidth < 600 )){
						ctx.moveTo( 50 * x ,y * height + lineStart);//スタート地点を変更しやすいように変数にしました
						ctx.lineTo( 50 * x ,(y * height + height + lineStart));
						ctx.stroke();
					} else {
						ctx.moveTo((canvas.width / (tree + 1)) * x ,y * height + lineStart);//スタート地点を変更しやすいように変数にしました
						ctx.lineTo((canvas.width / (tree + 1)) * x ,(y * height + height + lineStart));
						ctx.stroke();
					}
				} else {
										red[y-1][liten]= [x, x + 1, y];
										liten++;
										red[y-1][liten]= [x, x + 1, y];
										liten++;
					ctx.beginPath(); //x座標 width,y座標 height
					if ((tree < 10) && ( mainwidth < 600 )){
						ctx.moveTo( 50 * x, y * height + lineStart);
						ctx.lineTo( 50 * x,(y * height + height + lineStart));
						ctx.lineTo( 50 * (x + 1),(y * height + height + lineStart));
						ctx.moveTo( 50 * (x + 1), y * height + lineStart);
						ctx.lineTo( 50 * (x + 1),(y * height + height + lineStart));
						ctx.stroke();
						x++;
					} else {
						ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
						ctx.lineTo((canvas.width / (tree + 1)) * x,(y * height + height + lineStart));
						ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),(y * height + height + lineStart));
						ctx.moveTo((canvas.width / (tree + 1)) * (x + 1), y * height + lineStart);
						ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),(y * height + height + lineStart));
						ctx.stroke();
						x++;
					}
				}
			}
		}
		let undo = ctx.getImageData(0,0,canvas.width,canvas.height);



						for (let x =1; x<=tree; x++){
							let point = document.createElement('img');
							point.src = "丸icon.jpg";
							point.setAttribute("class","point");
							point.addEventListener('click', () =>{
								ctx.strokeStyle = '#e65353';
								ctx.lineWidth = 3;
								ctx.putImageData(undo,0,0);
								const r = x; 
								for(let y = 1; y <= treesize; y++){
									if ((tree < 10) && ( mainwidth < 600 )){
										ctx.moveTo( 50 * x, y * height + lineStart);
									} else {
										ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
									}
								 if(red[y-1][x -1][0]===x){
										ctx.beginPath();
										if ((tree < 10) && ( mainwidth < 600 )){
											ctx.moveTo( 50 * x, y * height + lineStart);
											ctx.lineTo( 50 * x,(y * height + height + lineStart));
											ctx.lineTo( 50 * (x + 1),(y * height + height + lineStart));
											ctx.stroke();
											x++;
										} else {
											ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
											ctx.lineTo((canvas.width / (tree + 1)) * x,(y * height + height + lineStart));
											ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),(y * height + height + lineStart));
											ctx.stroke();
											x++;
										}
									} else if(red[y-1][x -1][1] ===x){  // 配列の中からred[x、x+1 ,y]を見つけて、あったら
										ctx.beginPath();
										if ((tree < 10) && ( mainwidth < 600 )){
											ctx.moveTo( 50 * x, y * height + lineStart);
											ctx.lineTo( 50 * x,(y * height + height + lineStart));
											ctx.lineTo( 50 * (x - 1),(y * height + height + lineStart));
											ctx.stroke();
											x--;
										} else {
											ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
											ctx.lineTo((canvas.width / (tree + 1)) * x,(y * height + height + lineStart));
											ctx.lineTo((canvas.width / (tree + 1)) * (x - 1),(y * height + height + lineStart));
											ctx.stroke();
											x--;
										}
									} else{
										if ((tree < 10) && ( mainwidth < 600 )){
											ctx.beginPath();
											ctx.moveTo( 50 * x ,y * height + lineStart);
											ctx.lineTo( 50 * x ,(y * height + height + lineStart));
											ctx.stroke();
										} else {
											ctx.beginPath();
											ctx.moveTo((canvas.width / (tree + 1)) * x ,y * height + lineStart);
											ctx.lineTo((canvas.width / (tree + 1)) * x ,(y * height + height + lineStart));
											ctx.stroke();
										}	
									}
								}
								x = r;
							});
							document.getElementById("swich").appendChild(point);
							if ((tree < 10) && ( mainwidth < 600 )){
								let leftpos = (50 * x) - 3; //-3でちょうど線が真ん中になる
								point.style.left = leftpos + "px";
							} else {
								let leftpos = ((canvas.width / (tree + 1)) * x) - 3; //-3でちょうど線が真ん中になる
								point.style.left = leftpos + "px";
							}
						}
									
	}

	document.getElementById('am').addEventListener('click', () =>{
		document.getElementById('container').classList.remove('hidden');
		document.getElementById('am').classList.add('hyde');
	});

	document.getElementById('howto').addEventListener('click', () =>{
		const picture = document.getElementById('picture');
		picture.classList.remove('hyde');
		const top = document.getElementById('option');
		top.scrollIntoView();
		picture.addEventListener('click', () =>{
			picture.classList.add('hyde');
		});
	});

	const numberclick = document.getElementById('numberclick');
	const selectlist = document.getElementById('selectlist');
	const shadow = document.getElementById('shadow');
	numberclick.addEventListener('click', () =>{
		selectlist.classList.remove('hidden');
		shadow.classList.remove('hyde');
		shadow.addEventListener('click', () =>{
			shadow.classList.add('hyde');
			selectlist.classList.add('hidden');
		});
	});

	const make = document.getElementById('make');
	make.addEventListener('click', () =>{
		let tree0 = document.getElementById('selectnumber0').innerHTML;
		let tree1 = document.getElementById('selectnumber').innerHTML;
		tree = tree0 + tree1
		tree = Number(tree);

			if (document.getElementById('prefix_1') != null){     //あみだの本数を変えるとき、既にある選択肢入力ボックスをclearする
				const predq=document.getElementById('precontainer');
				const predqchild=predq.childNodes;
				const sufdq=document.getElementById('sufcontainer');
				const sufdqchild=sufdq.childNodes;
				for (i =0; i < predqchild.length; i++) { //親コンテナを引数にとって最初のコンテンツを消すのを繰り返してるから難しいかなあ
					precontainer[i] = predqchild[i].value;//pushだと無限に増えるからコンテナの数より多くなってしまう可能性
				}
				for (i =0; i < sufdqchild.length; i++) { //親コンテナを引数にとって最初のコンテンツを消すのを繰り返してるから難しいかなあ
					sufcontainer[i] = sufdqchild[i].value;//pushだと無限に増えるからコンテナの数より多くなってしまう可能性
				}
				while (predq.firstChild) {
					predq.removeChild(predq.firstChild);
				}
				while (sufdq.firstChild) {
					sufdq.removeChild(sufdq.firstChild);
				}
			}	

			
			
			for (let x = 1; x <= tree ; x++){     //選択肢入力ボックスをラジオボックスで入力した数だけ作る
				let prefix = document.createElement("input");
				prefix.setAttribute("type","text");
				prefix_id = 'prefix_' + x
				document.getElementById("precontainer").appendChild(prefix);
				prefix.setAttribute("id",prefix_id);
				prefix.setAttribute("class","textbox");
				if(precontainer.length > 0){
					if (x <= precontainer.length){
						prefix.value	= precontainer[x - 1];
					}
				}
				
				let suffix = document.createElement("input");
				suffix.setAttribute("type","text");
				suffix_id = 'suffix_' + x
				document.getElementById("sufcontainer").appendChild(suffix);
				suffix.setAttribute("id",suffix_id);
				suffix.setAttribute("class","textbox");
				if(sufcontainer.length > 0){
					if (x <= sufcontainer.length){
						if (sufcontainer[x -1] === undefined){
							sufcontainer[x -1] = "";
						}
						suffix.value = sufcontainer[x - 1];
					}
				}
			}
			let sufp = document.getElementById("sufcontainer");
			sufcontainer.length = sufp.childElementCount;

		document.getElementById('erase').classList.remove('hyde');
		document.getElementById('select').classList.remove('hyde');
		document.getElementById('option').classList.remove('hyde');
		document.getElementById('shadow').classList.add('hyde');
		selectlist.classList.add('hidden');

		document.getElementById('start').addEventListener('click', ()=>{
			if (document.getElementsByClassName('point') != null){     //あみだの本数を変えるとき、既にあるスタート丸ボタンをclearする
				const swich = document.getElementById('swich');
				while (swich.firstChild) {
					swich.removeChild(swich.firstChild);
				}
			}	

			amida(tree);
			document.getElementById('start').value = '作り直す';
			document.getElementById('container').classList.add('hyde');
			document.getElementById('option').classList.remove('hyde');
			document.getElementById('content').classList.remove('hidden');
			const top = document.getElementById('option');
			top.scrollIntoView();//オプションだけ一部非対応機種がある
		});
	});

	document.getElementById('option').addEventListener('click', () =>{
		document.getElementById('container').classList.toggle('hyde');
		document.getElementById('content').classList.toggle('hidden');
		document.getElementById('close').classList.remove('hyde');
	});
	document.getElementById('close').addEventListener('click', () =>{
		document.getElementById('container').classList.add('hyde');
		document.getElementById('content').classList.remove('hidden');
	});
	document.getElementById('erase').addEventListener('click', () =>{
		const inputs = document.getElementsByClassName('textbox');
		for (let i =0; i < inputs.length; i++){
			inputs[i].value = "";
			console.log(precontainer);
		}
		if (precontainer.length > 0){
			precontainer.length = 0;
		}
		if (sufcontainer.length > 0){
		sufcontainer.length = 0;
		}
		const top = document.getElementById('option');
		top.scrollIntoView();//オプションだけ一部非対応機種がある
	});
}
		function sel0(li){
			selectnumber0.innerHTML = li;
		};
		function sel(li){
			selectnumber.innerHTML = li;
		};
drawamida();
}
