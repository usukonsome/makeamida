{ //こちらはbabelでIE11用にコンパイルした物です。元のコードは隣のjsフォルダの中にあります
  'use strict';

  function drawamida() {
    var canvas = document.getElementById('canvas');

    if (!canvas.getContext || !canvas) {
      return;
		}
		var userAgent = window.navigator.userAgent.toLowerCase(); //IEかどうか調べるためにこれを追加しました

    var ctx = canvas.getContext('2d');
    var clientwidth = document.getElementById('clientwidth').clientWidth;
    var treesize = 17; //あみだのツリーの長さ

    var height = 20; //あみだのy軸の１行ごとの長さ

    var lineStart = 40; //y軸開始位置

    var wordStart = 25; //選択肢のy軸での開始位置

    var wordEnd = 425; //結果のy軸での開始位置

    var prefixArray = []; //選択肢が入る配列

    var suffixArray = []; //結果が入る配列

    var suffixArray2 = []; //結果をシャッフルした後の配列

    var prefix_id, suffix_id;

    function random() {
      return Math.floor(Math.random() * 2);
    } //入力された文字列を３文字ごとに改行します


    function spliteByLength(str, length) {
      resultArr = [];
      index = 0;
      start = 0;
      end = length;

      while (start < str.length) {
        resultArr[index] = str.substring(start, end);
        index++;
        start = end;
        end = start + length;
      }

      return resultArr;
    }

    var amida = function amida(tree) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.font = "bold 15px 'Avenir'";
      ctx.textAlign = 'center'; //選択肢を配列から取得してあみだのスタート地点に並べる

      for (var x = 1; x <= tree; x++) {
        prefix_id = 'prefix_' + x;
        prefixArray[x - 1] = document.getElementById(prefix_id).value;
        words = prefixArray[x - 1];
        words = spliteByLength(words, 3);

        for (var y = 0; y < words.length && y < 2; y++) {
          //y < 2で選択肢を2行に収める
          if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
            //狭い画面幅で少しでも見やすく
            ctx.fillText(words[y], 50 * x, wordStart + 15 * y);
          } else {
            ctx.fillText(words[y], canvas.width / (tree + 1) * x, wordStart + 15 * y);
          }
        }
      }

      suffixArray2 = []; //ここでsuffixArray2を空にする（重要）

      for (var _x = 1; _x <= tree; _x++) {
        suffix_id = 'suffix_' + _x;
        suffixArray[_x - 1] = document.getElementById(suffix_id).value;
      }

      for (var _x2 = 0; _x2 < suffixArray.length; _x2++) {
        suffixArray2[_x2] = suffixArray[_x2];
      } //suffixArray2の配列（あみだに出力される結果）の順番をシャッフルする


      for (var _i = suffixArray2.length - 1; _i > 0; _i--) {
        r = Math.floor(Math.random() * (_i + 1));
        tmp = suffixArray2[_i];
        suffixArray2[_i] = suffixArray2[r];
        suffixArray2[r] = tmp;
      } //(Fisher-Yates shuffle)


      for (var _x3 = 1; _x3 <= tree; _x3++) {
        words = suffixArray2[_x3 - 1];
        words = spliteByLength(words, 3);

        for (var _y = 0; _y < words.length; _y++) {
          if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
            ctx.fillText(words[_y], 50 * _x3, wordEnd + 15 * _y);
          } else {
            ctx.fillText(words[_y], canvas.width / (tree + 1) * _x3, wordEnd + 15 * _y);
          }
        }
      }

      ctx.strokeStyle = "#6e6e6e";
      ctx.lineWidth = 2;
      var redLine = []; //あみだを辿るときに使う座標を格納するコンテナ

      var redPoint;

      for (var _y2 = 1; _y2 <= treesize; _y2++) {
        redPoint = 0;
        redLine[_y2 - 1] = [redPoint]; //ここで２重配列を作る

        for (var _x4 = 1; _x4 <= tree; _x4++) {
          if (_x4 === tree || random() === 0 || _y2 === treesize) {
            redLine[_y2 - 1][redPoint] = [0, 0];
            redPoint++;
            ctx.beginPath();

            if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
              ctx.moveTo(50 * _x4, _y2 * height + lineStart);
              ctx.lineTo(50 * _x4, _y2 * height + height + lineStart);
              ctx.stroke();
            } else {
              ctx.moveTo(canvas.width / (tree + 1) * _x4, _y2 * height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * _x4, _y2 * height + height + lineStart);
              ctx.stroke();
            }
          } else {
            redLine[_y2 - 1][redPoint] = [_x4, _x4 + 1];
            redPoint++;
            redLine[_y2 - 1][redPoint] = [_x4, _x4 + 1]; //同じ座標を同じ列に２つ置く(右回り用と左回り用)

            redPoint++;
            ctx.beginPath();

            if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
              ctx.moveTo(50 * _x4, _y2 * height + lineStart);
              ctx.lineTo(50 * _x4, _y2 * height + height + lineStart);
              ctx.lineTo(50 * (_x4 + 1), _y2 * height + height + lineStart);
              ctx.moveTo(50 * (_x4 + 1), _y2 * height + lineStart);
              ctx.lineTo(50 * (_x4 + 1), _y2 * height + height + lineStart);
              ctx.stroke();
              _x4++;
            } else {
              ctx.moveTo(canvas.width / (tree + 1) * _x4, _y2 * height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * _x4, _y2 * height + height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * (_x4 + 1), _y2 * height + height + lineStart);
              ctx.moveTo(canvas.width / (tree + 1) * (_x4 + 1), _y2 * height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * (_x4 + 1), _y2 * height + height + lineStart);
              ctx.stroke();
              _x4++;
            }
          }
        }
      }

      var undo = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#e65353';
      ctx.lineWidth = 3;

      var _loop = function _loop(_x6) {
        point = document.createElement('img');
        point.src = "丸icon.jpg";
        point.setAttribute("class", "point");
        point.addEventListener('click', function () {
          ctx.putImageData(undo, 0, 0); //保存掛けた画像を置いて前に引いたあみだの赤い線をリセット

          r = _x6;

          for (var _y3 = 1; _y3 <= treesize; _y3++) {
            if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
              ctx.moveTo(50 * _x6, _y3 * height + lineStart);
            } else {
              ctx.moveTo(canvas.width / (tree + 1) * _x6, _y3 * height + lineStart);
            }

            if (redLine[_y3 - 1][_x6 - 1][0] === _x6) {
              //redLine配列の情報:[y座標[横棒始点のx, 横棒終点のx]]
              ctx.beginPath();

              if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
                ctx.moveTo(50 * _x6, _y3 * height + lineStart);
                ctx.lineTo(50 * _x6, _y3 * height + height + lineStart);
                ctx.lineTo(50 * (_x6 + 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x6++;
              } else {
                ctx.moveTo(canvas.width / (tree + 1) * _x6, _y3 * height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * _x6, _y3 * height + height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * (_x6 + 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x6++;
              }
            } else if (redLine[_y3 - 1][_x6 - 1][1] === _x6) {
              ctx.beginPath();

              if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
                ctx.moveTo(50 * _x6, _y3 * height + lineStart);
                ctx.lineTo(50 * _x6, _y3 * height + height + lineStart);
                ctx.lineTo(50 * (_x6 - 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x6--;
              } else {
                ctx.moveTo(canvas.width / (tree + 1) * _x6, _y3 * height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * _x6, _y3 * height + height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * (_x6 - 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x6--;
              }
            } else {
              if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
                ctx.beginPath();
                ctx.moveTo(50 * _x6, _y3 * height + lineStart);
                ctx.lineTo(50 * _x6, _y3 * height + height + lineStart);
                ctx.stroke();
              } else {
                ctx.beginPath();
                ctx.moveTo(canvas.width / (tree + 1) * _x6, _y3 * height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * _x6, _y3 * height + height + lineStart);
                ctx.stroke();
              }
            }
          }

          _x6 = r;
        });
        document.getElementById("swich").appendChild(point);

        if (tree < 10 && clientwidth < 600 && userAgent.indexOf('trident') === -1) {
          position = 50 * _x6 - 3; //-3でちょうど線が真ん中になる

          point.style.left = position + "px";
        } else {
          position = canvas.width / (tree + 1) * _x6 - 3;
          point.style.left = position + "px";
        }

        _x5 = _x6;
      };

      for (var _x5 = 1; _x5 <= tree; _x5++) {
        _loop(_x5);
      }
    };

    var mainContents = document.getElementById('main_contents');
    var continueAmida = document.getElementById('continue_amida');
    var shadow = document.getElementById('shadow');
    var clearWord = document.getElementById('clear_word');
    var amidaResult = document.getElementById('amida_result');
    var makeAmida = document.getElementById('make_amida');
    makeAmida.addEventListener('click', function () {
      mainContents.classList.remove('hidden');
      makeAmida.classList.add('hyde');
    });
    document.getElementById('description').addEventListener('click', function () {
      picture = document.getElementById('picture');
      picture.classList.remove('hyde');
      continueAmida.scrollIntoView();
      picture.addEventListener('click', function () {
        picture.classList.add('hyde');
      });
    });
    var numberList = document.getElementById('number_list');
    document.getElementById('number_nav').addEventListener('click', function () {
      numberList.classList.remove('hidden');
      shadow.classList.remove('hyde');
      shadow.addEventListener('click', function () {
        shadow.classList.add('hyde');
        numberList.classList.add('hidden');
      });
    });
    document.getElementById('make_word_arr').addEventListener('click', function () {
      var preDoc = document.getElementById('prefix_array');
      var sufDoc = document.getElementById('suffix_array');
      tree0 = document.getElementById('selectnumber10').innerHTML;
      tree1 = document.getElementById('selectnumber1').innerHTML;
      tree = tree0 + tree1;
      tree = Number(tree);

      if (document.getElementById('prefix_1') != null) {
        preChild = preDoc.childNodes;
        sufChild = sufDoc.childNodes;

        for (i = 0; i < preChild.length; i++) {
          //あみだの本数を途中で変えても、入力した文字列を確保する
          prefixArray[i] = preChild[i].value;
          suffixArray[i] = sufChild[i].value;
        }

        while (preDoc.firstChild) {
          //あみだの本数を変えるとき、既にある選択肢入力ボックスをclearする
          preDoc.removeChild(preDoc.firstChild);
          sufDoc.removeChild(sufDoc.firstChild);
        }
      }

      for (var x = 1; x <= tree; x++) {
        //選択肢入力ボックスをラジオボックスで入力した数だけ作る
        prefix = document.createElement("input");
        prefix.setAttribute("type", "text");
        prefix_id = 'prefix_' + x;
        preDoc.appendChild(prefix);
        prefix.setAttribute("id", prefix_id);
        prefix.setAttribute("class", "textbox");

        if (prefixArray.length > 0) {
          if (x <= prefixArray.length) {
            prefix.value = prefixArray[x - 1];
          }
        }

        suffix = document.createElement("input");
        suffix.setAttribute("type", "text");
        suffix_id = 'suffix_' + x;
        sufDoc.appendChild(suffix);
        suffix.setAttribute("id", suffix_id);
        suffix.setAttribute("class", "textbox");

        if (suffixArray.length > 0) {
          if (x <= suffixArray.length) {
            if (suffixArray[x - 1] === undefined) {
              suffixArray[x - 1] = "";
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
      document.getElementById('start').addEventListener('click', function () {
        if (document.getElementsByClassName('point') != null) {
          //あみだの本数を変えるとき、既にあるスタート丸ボタンをclearする
          var swich = document.getElementById('swich');

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
    var close = document.getElementById('close');
    continueAmida.addEventListener('click', function () {
      mainContents.classList.toggle('hyde');
      amidaResult.classList.toggle('hyde');
      close.classList.remove('hyde');
    });
    close.addEventListener('click', function () {
      mainContents.classList.add('hyde');
      amidaResult.classList.remove('hyde');
    });
    clearWord.addEventListener('click', function () {
      inputs = document.getElementsByClassName('textbox');

      for (var _i2 = 0; _i2 < inputs.length; _i2++) {
        inputs[_i2].value = "";
      }

      if (prefixArray.length > 0) {
        prefixArray.length = 0;
      }

      if (suffixArray.length > 0) {
        suffixArray.length = 0;
      }

      continueAmida.scrollIntoView();
    });
  }

  function select10(li) {
    selectnumber10.innerHTML = li;
  }

  ;

  function select1(li) {
    selectnumber1.innerHTML = li;
  }

  ;
  drawamida();
}