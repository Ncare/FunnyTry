'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoBang = function () {
  function GoBang(options) {
    _classCallCheck(this, GoBang);

    this.options = options;
    this.gobang = document.getElementById(options.selector);
    this.chessboard = this.gobang.children[0];
    this.chessmans = this.gobang.children[1];

    this.style = _extends({
      padding: 20,
      count: 20
    }, options.style);

    this.grid = {
      width: (this.gobang.clientWidth - this.style.padding * 2) / this.style.count,
      height: (this.gobang.clientHeight - this.style.padding * 2) / this.style.count
    };

    this.init();
  }

  _createClass(GoBang, [{
    key: 'init',
    value: function init() {

      this.role = 1;

      this.win = false;

      this.history = [];
      this.currentStep = 0;

      this.chessmans.onclick = null;
      this.chessmans.innerHTML = '';

      this.drawChessboard();
      this.initChessMatrix();
      this.listenChessman();
    }
  }, {
    key: 'initChessMatrix',
    value: function initChessMatrix() {

      var checkboard = [];
      for (var x = 0; x < this.style.count + 1; x++) {
        checkboard[x] = [];
        for (var y = 0; y < this.style.count + 1; y++) {
          checkboard[x][y] = 0;
        }
      }
      this.checkboard = checkboard;
    }
  }, {
    key: 'drawChessboard',
    value: function drawChessboard() {

      var grids = Array.from({
        length: this.style.count * this.style.count
      }, function () {
        return '<span class="grid"></span>';
      });

      this.chessboard.innerHTML = grids.join('');
      this.chessboard.className = 'chessboard grid-' + this.style.count;
      this.gobang.style.border = this.style.padding + 'px solid #eee';
    }
  }, {
    key: 'drawChessmans',
    value: function drawChessmans(x, y, isBlack) {
      var _this = this;

      var chessman = document.createElement('div');
      chessman.setAttribute('id', 'x' + x + '-y' + y + '-r' + (isBlack ? 1 : 2));
      chessman.className = isBlack ? 'chessman black' : 'chessman white';
      chessman.style.width = this.grid.width * 0.5;
      chessman.style.height = this.grid.height * 0.5;
      chessman.style.left = x * this.grid.width - this.grid.width * 0.25;
      chessman.style.top = y * this.grid.height - this.grid.height * 0.25;
      this.chessmans.appendChild(chessman);

      setTimeout(function () {
        _this.checkIfWin(x, y, isBlack ? 1 : 2);
      }, 0);
    }
  }, {
    key: 'listenChessman',
    value: function listenChessman() {
      var _this2 = this;

      this.chessmans.onclick = function (event) {
        if (event.target.className.includes('chessman ')) {
          return false;
        }

        var x = event.offsetX,
            y = event.offsetY;

        x = Math.round(x / _this2.grid.width);
        y = Math.round(y / _this2.grid.height);

        var effectiveBoard = !!_this2.checkboard[x];
        if (effectiveBoard && _this2.checkboard[x][y] !== undefined && Object.is(_this2.checkboard[x][y], 0)) {
          _this2.checkboard[x][y] = _this2.role;
          _this2.drawChessmans(x, y, Object.is(_this2.role, 1)

          // 保证了悔棋，撤销的操作的正确性
          );_this2.history.length = _this2.currentStep;
          _this2.history.push({ x: x, y: y, role: _this2.role });
          _this2.currentStep++;

          _this2.role = Object.is(_this2.role, 1) ? 2 : 1;
        }
      };
    }
  }, {
    key: 'checkIfWin',
    value: function checkIfWin(x, y, role) {
      if (!x || !y || !role) return;

      var count = 0;

      var XVector = this.checkboard.map(function (x) {
        return x[y];
      });
      var YVector = this.checkboard[x];
      var leftVector = [];
      var rightVector = [];

      this.checkboard.forEach(function (vec, i) {

        var leftItem = vec[y - (x - i)];
        if (leftItem !== undefined) {
          leftVector.push(leftItem);
        }

        var rightItem = vec[y + (x - i)];
        if (rightItem !== undefined) {
          rightVector.push(rightItem);
        }
      });

      [XVector, YVector, leftVector, rightVector].forEach(function (axis) {
        if (axis.some(function (x, i) {
          return axis[i] !== 0 && axis[i - 2] === axis[i - 1] && axis[i - 1] === axis[i] && axis[i] === axis[i + 1] && axis[i + 1] === axis[i + 2];
        })) {

          count++;
        }
      });

      if (count) {
        this.chessmans.onclick = null;
        this.win = true;

        alert((role == 1 ? '黑' : '白') + '子胜');
      }
    }
  }, {
    key: 'retractGame',
    value: function retractGame() {

      if (this.history.length && !this.win) {
        var prevStep = this.history[this.currentStep - 1];
        if (prevStep) {
          var x = prevStep.x,
              y = prevStep.y,
              role = prevStep.role;

          var chessman = document.getElementById('x' + x + '-y' + y + '-r' + role);
          this.chessmans.removeChild(chessman);
          this.checkboard[x][y] = 0;
          this.currentStep--;
        }
      }
    }
  }, {
    key: 'revoke',
    value: function revoke() {

      var next = this.history[this.currentStep];
      if (next) {
        this.drawChessmans(next.x, next.y, next.role === 1);
        this.checkboard[next.x][next.y] = next.role;
        this.currentStep++;
      }
    }
  }]);

  return GoBang;
}();