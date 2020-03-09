{
	'use strict'
	function drawamida(){
		const canvas = document.getElementById('canvas');
		if (!canvas.getContext || !canvas){
			return;
		}
		const ctx = canvas.getContext('2d');

		const clientwidth = document.getElementById('clientwidth').clientWidth;
		const treesize = 17; //あみだのツリーの長さ
		const height = 20; //あみだのy軸の１行ごとの長さ
		const lineStart = 40; //y軸開始位置
		const wordStart = 25; //選択肢のy軸での開始位置 //挿入
		const wordEnd = 425; //結果のy軸での開始位置 //挿入
		const prefixArray = []; //選択肢が入る配列
		const suffixArray = []; //結果が入る配列
		let suffixArray2 = []; //結果をシャッフルした後の配列
		let prefix_id,suffix_id;

		function random(){
			return Math.floor(Math.random() * 2);
		}
		//入力された文字列を３文字ごとに改行します
		function spliteByLength(str, length){
			resultArr = [];
			index = 0;
			start = 0;
			end = length;
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
			ctx.font = "bold 15px 'Avenir'";
			ctx.textAlign = 'center';

		//選択肢を配列から取得してあみだのスタート地点に並べる
			for (let x = 1; x <= tree; x++){
				prefix_id = 'prefix_' + x;
				prefixArray[x - 1] = document.getElementById(prefix_id).value;
				words = prefixArray[x - 1];
				words = spliteByLength(words, 3);
				for (let y = 0; y < words.length && y < 2; y++){ //y < 2で選択肢を2行に収める
					if ((tree < 10) && ( clientwidth < 600 )){ //狭い画面幅で少しでも見やすく
						ctx.fillText(words[y], 50 * x, wordStart + 15 * y);
					} else {
						ctx.fillText(words[y], (canvas.width / (tree + 1)) * x, wordStart + 15 * y);
					}
				}
			}

			suffixArray2 = []; //ここでsuffixArray2を空にする（重要）

			for (let x = 1; x <= tree; x++){
				suffix_id = 'suffix_' + x
				suffixArray[x - 1] = document.getElementById(suffix_id).value;
			}

			for(let x = 0; x < suffixArray.length; x++){
				suffixArray2[x] = suffixArray[x];
			}

			//suffixArray2の配列（あみだに出力される結果）の順番をシャッフルする
			for (let i = suffixArray2.length - 1; i > 0; i--){ 
				r = Math.floor(Math.random() * (i + 1));
				tmp = suffixArray2[i];
				suffixArray2[i] = suffixArray2[r];
				suffixArray2[r] = tmp;
			} //(Fisher-Yates shuffle)

			for (let x = 1; x <= tree; x++){
				words = suffixArray2[x - 1];
				words = spliteByLength(words, 3);
				for (let y = 0; y < words.length; y++){
					if ((tree < 10) && ( clientwidth < 600 )){
						ctx.fillText(words[y], 50 * x, wordEnd + 15 * y);
					} else {
						ctx.fillText(words[y],(canvas.width / (tree + 1)) * x, wordEnd + 15 * y);
					}
				}
			}

			ctx.strokeStyle = "#6e6e6e"
			ctx.lineWidth = 2;

			const redLine = [];//あみだを辿るときに使う座標を格納するコンテナ
			let redPoint;

			for (let y = 1; y <= treesize; y++){
				redPoint = 0;
				redLine[y - 1] = [redPoint];//ここで２重配列を作る

				for (let x = 1; x <= tree; x++){
					if (x === tree || random() === 0 || y === treesize){
						redLine[y - 1][redPoint] = [0,0];
						redPoint++;

						ctx.beginPath();
						if ((tree < 10) && ( clientwidth < 600 )){
							ctx.moveTo( 50 * x ,y * height + lineStart);
							ctx.lineTo( 50 * x ,((y + 1) * height + lineStart));
							ctx.stroke();
						} else {
							ctx.moveTo((canvas.width / (tree + 1)) * x ,y * height + lineStart);
							ctx.lineTo((canvas.width / (tree + 1)) * x ,((y + 1) * height + lineStart));
							ctx.stroke();
						}
					} else {
						for (let t = 0; t < 2; t++){
							redLine[y - 1][redPoint]= [x, x + 1]; //同じ座標を同じ列に２つ置く(右回り用と左回り用)
							redPoint++;
						}

						ctx.beginPath();
						if ((tree < 10) && ( clientwidth < 600 )){
							ctx.moveTo( 50 * x, y * height + lineStart);
							ctx.lineTo( 50 * x,((y + 1) * height + lineStart));
							ctx.lineTo( 50 * (x + 1),((y + 1) * height + lineStart));
							ctx.moveTo( 50 * (x + 1), y * height + lineStart);
							ctx.lineTo( 50 * (x + 1),((y + 1) * height + lineStart));
							ctx.stroke();
							x++;
						} else {
							ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
							ctx.lineTo((canvas.width / (tree + 1)) * x,((y + 1) * height + lineStart));
							ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),((y + 1) * height + lineStart));
							ctx.moveTo((canvas.width / (tree + 1)) * (x + 1), y * height + lineStart);
							ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),((y + 1) * height + lineStart));
							ctx.stroke();
							x++;
						}
					}
				}
			}

			const undo = ctx.getImageData(0,0,canvas.width,canvas.height);

			ctx.strokeStyle = '#e65353';
			ctx.lineWidth = 3;

			for (let x = 1; x <= tree; x++){
				point = document.createElement('img');
				point.src = "丸icon.jpg";
				point.setAttribute("class","point");
				point.addEventListener('click', () =>{
					ctx.putImageData(undo,0,0); //保存掛けた画像を置いて前に引いたあみだの赤い線をリセット
					r = x; 
					for(let y = 1; y <= treesize; y++){
						if ((tree < 10) && ( clientwidth < 600 )){
							ctx.moveTo( 50 * x, y * height + lineStart);
						} else {
							ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
						}
						if(redLine[y - 1][x - 1][0]===x){ //redLine配列の情報:[y座標[横棒始点のx, 横棒終点のx]]
							ctx.beginPath();
							if ((tree < 10) && ( clientwidth < 600 )){
								ctx.moveTo( 50 * x, y * height + lineStart);
								ctx.lineTo( 50 * x,((y + 1) * height + lineStart));
								ctx.lineTo( 50 * (x + 1),((y + 1) * height + lineStart));
								ctx.stroke();
								x++;
							} else {
								ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
								ctx.lineTo((canvas.width / (tree + 1)) * x,((y + 1) * height + lineStart));
								ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),((y + 1) * height + lineStart));
								ctx.stroke();
								x++;
							}
						} else if(redLine[y - 1][x - 1][1] ===x){
							ctx.beginPath();
							if ((tree < 10) && ( clientwidth < 600 )){
								ctx.moveTo( 50 * x, y * height + lineStart);
								ctx.lineTo( 50 * x,((y + 1) * height + lineStart));
								ctx.lineTo( 50 * (x - 1),((y + 1) * height + lineStart));
								ctx.stroke();
								x--;
							} else {
								ctx.moveTo((canvas.width / (tree + 1)) * x, y * height + lineStart);
								ctx.lineTo((canvas.width / (tree + 1)) * x,((y + 1) * height + lineStart));
								ctx.lineTo((canvas.width / (tree + 1)) * (x - 1),((y + 1) * height + lineStart));
								ctx.stroke();
								x--;
							}
						} else{
							if ((tree < 10) && ( clientwidth < 600 )){
								ctx.beginPath();
								ctx.moveTo( 50 * x ,y * height + lineStart);
								ctx.lineTo( 50 * x ,((y + 1) * height + lineStart));
								ctx.stroke();
							} else {
								ctx.beginPath();
								ctx.moveTo((canvas.width / (tree + 1)) * x ,y * height + lineStart);
								ctx.lineTo((canvas.width / (tree + 1)) * x ,((y + 1) * height + lineStart));
								ctx.stroke();
							}
						}
					}
					x = r;
				});

				document.getElementById("swich").appendChild(point);
				if ((tree < 10) && ( clientwidth < 600 )){
					position = (50 * x) - 3; //-3でちょうど線が真ん中になる
					point.style.left = position + "px";
				} else {
					position = ((canvas.width / (tree + 1)) * x) - 3;
					point.style.left = position + "px";
				}
			}
		}

		const mainContents = document.getElementById('main_contents');
		const continueAmida = document.getElementById('continue_amida');
		const shadow = document.getElementById('shadow');
		const clearWord = document.getElementById('clear_word');
		const amidaResult = document.getElementById('amida_result');
		
		const makeAmida = document.getElementById('make_amida');
		makeAmida.addEventListener('click', () =>{
			mainContents.classList.remove('hidden');
			makeAmida.classList.add('hyde');
		});

		document.getElementById('description').addEventListener('click', () =>{
			picture = document.getElementById('picture');
			picture.classList.remove('hyde');
			continueAmida.scrollIntoView();
			picture.addEventListener('click', () =>{
				picture.classList.add('hyde');
			});
		});

		const numberList = document.getElementById('number_list');
		document.getElementById('number_nav').addEventListener('click', () =>{
			numberList.classList.remove('hidden');
			shadow.classList.remove('hyde');
			shadow.addEventListener('click', () =>{
				shadow.classList.add('hyde');
				numberList.classList.add('hidden');
			});
		});

		document.getElementById('make_word_arr').addEventListener('click', () => {
			const preDoc = document.getElementById('prefix_array');
			const sufDoc = document.getElementById('suffix_array');

			tree0 = document.getElementById('selectnumber10').innerHTML;
			tree1 = document.getElementById('selectnumber1').innerHTML;
			tree = tree0 + tree1
			tree = Number(tree);

			if (document.getElementById('prefix_1') != null){
				preChild = preDoc.childNodes;
				sufChild = sufDoc.childNodes;
				for (i =0; i < preChild.length; i++) { //あみだの本数を途中で変えても、入力した文字列を確保する
					prefixArray[i] = preChild[i].value;
					suffixArray[i] = sufChild[i].value;
				}
				while (preDoc.firstChild) { //あみだの本数を変えるとき、既にある選択肢入力ボックスをclearする
					preDoc.removeChild(preDoc.firstChild);
					sufDoc.removeChild(sufDoc.firstChild);
				}
			}	
				
			for (let x = 1; x <= tree ; x++){ //選択肢入力ボックスをラジオボックスで入力した数だけ作る
				prefix = document.createElement("input");
				prefix.setAttribute("type","text");
				prefix_id = 'prefix_' + x
				preDoc.appendChild(prefix);
				prefix.setAttribute("id",prefix_id);
				prefix.setAttribute("class","textbox");
				if(prefixArray.length > 0){
					if (x <= prefixArray.length){
						prefix.value	= prefixArray[x - 1];
					}
				}
					
				suffix = document.createElement("input");
				suffix.setAttribute("type","text");
				suffix_id = 'suffix_' + x
				sufDoc.appendChild(suffix);
				suffix.setAttribute("id",suffix_id);
				suffix.setAttribute("class","textbox");
				if(suffixArray.length > 0){
					if (x <= suffixArray.length){
						if (suffixArray[x -1] === undefined){
							suffixArray[x -1] = "";
						}
						suffix.value = suffixArray[x - 1];
					}
				}
			}
			suffixArray.length = sufDoc.childElementCount; //この一行がないと削除されたsuffixの文字列があみだに表示される

			clearWord.classList.remove('hyde');
			document.getElementById('select_list').classList.remove('hyde');
			continueAmida.classList.remove('hyde');
			shadow.classList.add('hyde');
			numberList.classList.add('hidden');

			document.getElementById('start').addEventListener('click', ()=>{
				if (document.getElementsByClassName('point') != null){ //あみだの本数を変えるとき、既にあるスタート丸ボタンをclearする
					const swich = document.getElementById('swich');
					while (swich.firstChild) {
						swich.removeChild(swich.firstChild);
					}
				}	

				amida(tree);
				mainContents.classList.add('hyde');
				continueAmida.classList.remove('hyde');
				amidaResult.classList.remove('hyde');
				continueAmida.scrollIntoView();
			});
		});

		const close = document.getElementById('close');
		continueAmida.addEventListener('click', () =>{
			mainContents.classList.toggle('hyde');
			amidaResult.classList.toggle('hyde');
			close.classList.remove('hyde');
		});
		
		close.addEventListener('click', () =>{
			mainContents.classList.add('hyde');
			amidaResult.classList.remove('hyde');
		});

		clearWord.addEventListener('click', () =>{
			inputs = document.getElementsByClassName('textbox');
			for (let i =0; i < inputs.length; i++){
				inputs[i].value = "";
			}
			if (prefixArray.length > 0){
				prefixArray.length = 0;
			}
			if (suffixArray.length > 0){
			suffixArray.length = 0;
			}
			continueAmida.scrollIntoView();
		});
	}

	function select10(li){
		selectnumber10.innerHTML = li;
	};
	function select1(li){
		selectnumber1.innerHTML = li;
	};

	drawamida();
}
