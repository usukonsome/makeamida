"use strict";

{
  var drawamida = function drawamida() {
    var canvas = document.getElementById('canvas');

    if (!canvas.getContext || !canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var w = document.getElementById('content').clientWidth;
    var h = document.getElementById('content').clientHeight;
    var mainwidth = document.getElementById('clientwidth').clientWidth;
    canvas.width = w - 10; //canvasはbox-sizing合わせてくれないのでこっちで合わせる

    canvas.height = h - 10;
    var treesize = 17;
    var height = 20;
    var lineStart = 40;
    var precontainer = [];
    var sufcontainer = [];
    var sufcontainer2 = [];
    var prefix_id, suffix_id, words;
    var red = [];

    function random() {
      return Math.floor(Math.random() * 2);
    }

    function spliteByLength(str, length) {
      //入力された文字列を３文字ごとに改行します
      var resultArr = [];
      var index = 0;
      var start = 0;
      var end = length;

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

      for (var x = 1; x <= tree; x++) {
        prefix_id = 'prefix_' + x;
        precontainer[x - 1] = document.getElementById(prefix_id).value;
      }

      for (var _x = 1; _x <= tree; _x++) {
        ctx.font = "bold 15px 'Avenir'";
        ctx.textAlign = 'center';
        words = precontainer[_x - 1];
        words = spliteByLength(words, 3);

        for (var y = 0; y < words.length && y < 2; y++) {
          if (tree < 10 && mainwidth < 600) {
            ctx.fillText(words[y], 50 * _x, 25 + 15 * y);
          } else {
            ctx.fillText(words[y], canvas.width / (tree + 1) * _x, 25 + 15 * y);
          }
        }
      }

      sufcontainer2 = [];

      for (var _x2 = 1; _x2 <= tree; _x2++) {
        suffix_id = 'suffix_' + _x2;
        sufcontainer[_x2 - 1] = document.getElementById(suffix_id).value;
      }

      for (var _x3 = 0; _x3 < sufcontainer.length; _x3++) {
        sufcontainer2[_x3] = sufcontainer[_x3];
      }

      for (var _i = sufcontainer2.length - 1; _i > 0; _i--) {
        //ここでsuf配列をシャッフルします
        var r = Math.floor(Math.random() * (_i + 1));
        var tmp = sufcontainer2[_i];
        sufcontainer2[_i] = sufcontainer2[r];
        sufcontainer2[r] = tmp; //iとrの値を交換してる(Fisher-Yates shuffle)
      }

      for (var _x4 = 1; _x4 <= tree; _x4++) {
        ctx.font = "bold 15px 'Avenir'";
        ctx.textAlign = 'center';
        words = sufcontainer2[_x4 - 1];
        words = spliteByLength(words, 3);

        for (var _y = 0; _y < words.length; _y++) {
          if (tree < 10 && mainwidth < 600) {
            ctx.fillText(words[_y], 50 * _x4, 425 + 15 * _y);
          } else {
            ctx.fillText(words[_y], canvas.width / (tree + 1) * _x4, 425 + 15 * _y);
          }
        }
      }

      ctx.strokeStyle = "#6e6e6e";
      var liten;

      for (var _y2 = 1; _y2 <= treesize; _y2++) {
        //忘れがちだけどこれは横一列に描画してる
        liten = 0;
        red[_y2 - 1] = [liten];

        for (var _x5 = 1; _x5 <= tree; _x5++) {
          ctx.lineWidth = 2;

          if (_x5 === tree || random() === 0 || _y2 === treesize) {
            red[_y2 - 1][liten] = [0, 0, 0];
            liten++;
            ctx.beginPath();

            if (tree < 10 && mainwidth < 600) {
              ctx.moveTo(50 * _x5, _y2 * height + lineStart); //スタート地点を変更しやすいように変数にしました

              ctx.lineTo(50 * _x5, _y2 * height + height + lineStart);
              ctx.stroke();
            } else {
              ctx.moveTo(canvas.width / (tree + 1) * _x5, _y2 * height + lineStart); //スタート地点を変更しやすいように変数にしました

              ctx.lineTo(canvas.width / (tree + 1) * _x5, _y2 * height + height + lineStart);
              ctx.stroke();
            }
          } else {
            red[_y2 - 1][liten] = [_x5, _x5 + 1, _y2];
            liten++;
            red[_y2 - 1][liten] = [_x5, _x5 + 1, _y2];
            liten++;
            ctx.beginPath(); //x座標 width,y座標 height

            if (tree < 10 && mainwidth < 600) {
              ctx.moveTo(50 * _x5, _y2 * height + lineStart);
              ctx.lineTo(50 * _x5, _y2 * height + height + lineStart);
              ctx.lineTo(50 * (_x5 + 1), _y2 * height + height + lineStart);
              ctx.moveTo(50 * (_x5 + 1), _y2 * height + lineStart);
              ctx.lineTo(50 * (_x5 + 1), _y2 * height + height + lineStart);
              ctx.stroke();
              _x5++;
            } else {
              ctx.moveTo(canvas.width / (tree + 1) * _x5, _y2 * height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * _x5, _y2 * height + height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * (_x5 + 1), _y2 * height + height + lineStart);
              ctx.moveTo(canvas.width / (tree + 1) * (_x5 + 1), _y2 * height + lineStart);
              ctx.lineTo(canvas.width / (tree + 1) * (_x5 + 1), _y2 * height + height + lineStart);
              ctx.stroke();
              _x5++;
            }
          }
        }
      }

      var undo = ctx.getImageData(0, 0, canvas.width, canvas.height);

      var _loop = function _loop(_x7) {
        var point = document.createElement('img');
        point.src = "丸icon.jpg";
        point.setAttribute("class", "point");
        point.addEventListener('click', function () {
          ctx.strokeStyle = '#e65353';
          ctx.lineWidth = 3;
          ctx.putImageData(undo, 0, 0);
          var r = _x7;

          for (var _y3 = 1; _y3 <= treesize; _y3++) {
            if (tree < 10 && mainwidth < 600) {
              ctx.moveTo(50 * _x7, _y3 * height + lineStart);
            } else {
              ctx.moveTo(canvas.width / (tree + 1) * _x7, _y3 * height + lineStart);
            }

            if (red[_y3 - 1][_x7 - 1][0] === _x7) {
              ctx.beginPath();

              if (tree < 10 && mainwidth < 600) {
                ctx.moveTo(50 * _x7, _y3 * height + lineStart);
                ctx.lineTo(50 * _x7, _y3 * height + height + lineStart);
                ctx.lineTo(50 * (_x7 + 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x7++;
              } else {
                ctx.moveTo(canvas.width / (tree + 1) * _x7, _y3 * height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * _x7, _y3 * height + height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * (_x7 + 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x7++;
              }
            } else if (red[_y3 - 1][_x7 - 1][1] === _x7) {
              // 配列の中からred[x、x+1 ,y]を見つけて、あったら
              ctx.beginPath();

              if (tree < 10 && mainwidth < 600) {
                ctx.moveTo(50 * _x7, _y3 * height + lineStart);
                ctx.lineTo(50 * _x7, _y3 * height + height + lineStart);
                ctx.lineTo(50 * (_x7 - 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x7--;
              } else {
                ctx.moveTo(canvas.width / (tree + 1) * _x7, _y3 * height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * _x7, _y3 * height + height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * (_x7 - 1), _y3 * height + height + lineStart);
                ctx.stroke();
                _x7--;
              }
            } else {
              if (tree < 10 && mainwidth < 600) {
                ctx.beginPath();
                ctx.moveTo(50 * _x7, _y3 * height + lineStart);
                ctx.lineTo(50 * _x7, _y3 * height + height + lineStart);
                ctx.stroke();
              } else {
                ctx.beginPath();
                ctx.moveTo(canvas.width / (tree + 1) * _x7, _y3 * height + lineStart);
                ctx.lineTo(canvas.width / (tree + 1) * _x7, _y3 * height + height + lineStart);
                ctx.stroke();
              }
            }
          }

          _x7 = r;
        });
        document.getElementById("swich").appendChild(point);

        if (tree < 10 && mainwidth < 600) {
          var leftpos = 50 * _x7 - 3; //-3でちょうど線が真ん中になる

          point.style.left = leftpos + "px";
        } else {
          var _leftpos = canvas.width / (tree + 1) * _x7 - 3; //-3でちょうど線が真ん中になる


          point.style.left = _leftpos + "px";
        }

        _x6 = _x7;
      };

      for (var _x6 = 1; _x6 <= tree; _x6++) {
        _loop(_x6);
      }
    };

    document.getElementById('am').addEventListener('click', function () {
      document.getElementById('container').classList.remove('hidden');
      document.getElementById('am').classList.add('hyde');
    });
    document.getElementById('howto').addEventListener('click', function () {
      var picture = document.getElementById('picture');
      picture.classList.remove('hyde');
      var top = document.getElementById('option');
      top.scrollIntoView();
      picture.addEventListener('click', function () {
        picture.classList.add('hyde');
      });
    });
    var numberclick = document.getElementById('numberclick');
    var selectlist = document.getElementById('selectlist');
    var shadow = document.getElementById('shadow');
    numberclick.addEventListener('click', function () {
      selectlist.classList.remove('hidden');
      shadow.classList.remove('hyde');
      shadow.addEventListener('click', function () {
        shadow.classList.add('hyde');
        selectlist.classList.add('hidden');
      });
    });
    var make = document.getElementById('make');
    make.addEventListener('click', function () {
      var tree0 = document.getElementById('selectnumber0').innerHTML;
      var tree1 = document.getElementById('selectnumber').innerHTML;
      var tree = tree0 + tree1;
      tree = Number(tree);

      if (document.getElementById('prefix_1') != null) {
        //あみだの本数を変えるとき、既にある選択肢入力ボックスをclearする
        var predq = document.getElementById('precontainer');
        var predqchild = predq.childNodes;
        var sufdq = document.getElementById('sufcontainer');
        var sufdqchild = sufdq.childNodes;

        for (var i = 0; i < predqchild.length; i++) {
          //親コンテナを引数にとって最初のコンテンツを消すのを繰り返してるから難しいかなあ
          precontainer[i] = predqchild[i].value; //pushだと無限に増えるからコンテナの数より多くなってしまう可能性
        }

        for (var i = 0; i < sufdqchild.length; i++) {
          //親コンテナを引数にとって最初のコンテンツを消すのを繰り返してるから難しいかなあ
          sufcontainer[i] = sufdqchild[i].value; //pushだと無限に増えるからコンテナの数より多くなってしまう可能性
        }

        while (predq.firstChild) {
          predq.removeChild(predq.firstChild);
        }

        while (sufdq.firstChild) {
          sufdq.removeChild(sufdq.firstChild);
        }
      }

      for (var x = 1; x <= tree; x++) {
        //選択肢入力ボックスをラジオボックスで入力した数だけ作る
        var prefix = document.createElement("input");
        prefix.setAttribute("type", "text");
        prefix_id = 'prefix_' + x;
        document.getElementById("precontainer").appendChild(prefix);
        prefix.setAttribute("id", prefix_id);
        prefix.setAttribute("class", "textbox");

        if (precontainer.length > 0) {
          if (x <= precontainer.length) {
            prefix.value = precontainer[x - 1];
          }
        }

        var suffix = document.createElement("input");
        suffix.setAttribute("type", "text");
        suffix_id = 'suffix_' + x;
        document.getElementById("sufcontainer").appendChild(suffix);
        suffix.setAttribute("id", suffix_id);
        suffix.setAttribute("class", "textbox");

        if (sufcontainer.length > 0) {
          if (x <= sufcontainer.length) {
            if (sufcontainer[x - 1] === undefined) {
              sufcontainer[x - 1] = "";
            }

            suffix.value = sufcontainer[x - 1];
          }
        }
      }

      var sufp = document.getElementById("sufcontainer");
      sufcontainer.length = sufp.childElementCount;
      document.getElementById('erase').classList.remove('hyde');
      document.getElementById('select').classList.remove('hyde');
      document.getElementById('option').classList.remove('hyde');
      document.getElementById('shadow').classList.add('hyde');
      selectlist.classList.add('hidden');
      document.getElementById('start').addEventListener('click', function () {
        if (document.getElementsByClassName('point') != null) {
          //あみだの本数を変えるとき、既にあるスタート丸ボタンをclearする
          var swich = document.getElementById('swich');

          while (swich.firstChild) {
            swich.removeChild(swich.firstChild);
          }
        }

        amida(tree);
        document.getElementById('start').value = '作り直す';
        document.getElementById('container').classList.add('hyde');
        document.getElementById('option').classList.remove('hyde');
        document.getElementById('content').classList.remove('hidden');
        var top = document.getElementById('option');
        top.scrollIntoView(); //オプションだけ一部非対応機種がある
      });
    });
    document.getElementById('option').addEventListener('click', function () {
      document.getElementById('container').classList.toggle('hyde');
      document.getElementById('content').classList.toggle('hidden');
      document.getElementById('close').classList.remove('hyde');
    });
    document.getElementById('close').addEventListener('click', function () {
      document.getElementById('container').classList.add('hyde');
      document.getElementById('content').classList.remove('hidden');
    });
    document.getElementById('erase').addEventListener('click', function () {
      var inputs = document.getElementsByClassName('textbox');

      for (var _i2 = 0; _i2 < inputs.length; _i2++) {
        inputs[_i2].value = "";
      }

      if (precontainer.length > 0) {
        precontainer.length = 0;
      }

      if (sufcontainer.length > 0) {
        sufcontainer.length = 0;
      }

      var top = document.getElementById('option');
      top.scrollIntoView(); //オプションだけ一部非対応機種がある
    });
  };

  var sel0 = function sel0(li) {
    selectnumber0.innerHTML = li;
  };

  var sel = function sel(li) {
    selectnumber.innerHTML = li;
  };

  'use strict';

  ;
  ;
  drawamida();
}