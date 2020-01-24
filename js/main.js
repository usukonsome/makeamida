{
	'use strict'
	function drawamida(){
	const canvas = document.getElementById('canvas');
	if (!canvas.getContext || !canvas){
		return;
	}
	const ctx = canvas.getContext('2d');

	const treesize = 20;
	const precontainer = [];
	let sufcontainer = [];
	let sufcontainer2 = [];
	let prefix_id,suffix_id,words;

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
		const w = document.getElementById('content').clientWidth;
		const h = document.getElementById('content').clientHeight;

		canvas.width = w -10; //canvasはbox-sizing合わせてくれないのでこっちで合わせる
		canvas.height = h - 10;

		ctx.clearRect(0,0,canvas.width,	canvas.height);

		for (let x = 1; x <= tree; x++){
			prefix_id = 'prefix_' + x
			precontainer[x-1] = document.getElementById(prefix_id).value;
		}

		for (let x = 1; x <= tree; x++){
			ctx.font = 'normal 12px Verdana';
			ctx.textAlign = 'center';
			ctx.lineWidth = 1;
			words = precontainer[x-1];
			words = spliteByLength(words, 3);
			for (let y = 0; y < words.length && y < 2; y++){
				ctx.strokeText(words[y], (canvas.width / (tree + 1)) * x, 30 + 15 * y);
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
			ctx.font = 'normal 12px Verdana';
			ctx.textAlign = 'center';
			words = sufcontainer2[x-1];
			words = spliteByLength(words, 3);
			for (let y = 0; y < words.length; y++){
				ctx.strokeText(words[y],(canvas.width / (tree + 1)) * x, 570 + 15 * y);
			}
		}

		for (let y = 1; y <= treesize; y++){ //忘れがちだけどこれは横一列に描画してる
			for (let x = 1; x <= tree; x++){
				ctx.lineWidth = 2;
				if (x === tree || random() === 0 || y === treesize){
					ctx.beginPath();
					ctx.moveTo((canvas.width / (tree + 1)) * x ,y * 25 + 25);//スタート地点を下に25ずらしました
					ctx.lineTo((canvas.width / (tree + 1)) * x ,(y * 25 + 25 + 25));
					ctx.stroke();
				} else {
					ctx.beginPath(); //x座標 width,y座標 height
					ctx.moveTo((canvas.width / (tree + 1)) * x, y * 25 + 25);
					ctx.lineTo((canvas.width / (tree + 1)) * x,(y * 25 + 25 + 25));
					ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),(y * 25 + 25 + 25));
					ctx.moveTo((canvas.width / (tree + 1)) * (x + 1), y * 25 + 25);
					ctx.lineTo((canvas.width / (tree + 1)) * (x + 1),(y * 25 + 25 + 25));
					ctx.stroke();
					x++;
				}
			}
		}
	}

	document.getElementById('am').addEventListener('click', () =>{
		document.getElementById('container').classList.remove('hidden');
		document.getElementById('am').classList.add('hyde');
	});

	document.getElementById('tree').addEventListener('change', () =>{
		let tree = document.getElementById('tree').value;
		tree = Number(tree);

			if (document.getElementById('prefix_1') != null){     //あみだの本数を変えるとき、既にある選択肢入力ボックスをclearする
				const predq=document.getElementById('precontainer');
				const sufdq=document.getElementById('sufcontainer');
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

		document.getElementById('select').classList.remove('hyde');
		document.getElementById('start').addEventListener('click', ()=>{
			amida(tree);
			document.getElementById('start').value = '作り直す';
			document.getElementById('container').classList.add('hyde');
			document.getElementById('option').classList.remove('hyde');
			document.querySelector('canvas').classList.remove('hyde');
		});
	});

	document.getElementById('option').addEventListener('click', () =>{
		document.getElementById('container').classList.remove('hyde');
		document.querySelector('canvas').classList.add('hyde');
	});
}
drawamida();
}
