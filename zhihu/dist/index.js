'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = function () {
  function Circle(x, y, type) {
    _classCallCheck(this, Circle);

    this.x = x;
    this.y = y;
    this.r = Math.random() * 10;
    if (type == 'l') {
      this._mx = Math.random();
      this._my = Math.random();
    } else {
      this._mx = -Math.random();
      this._my = -Math.random();
    }
  }

  _createClass(Circle, [{
    key: 'drawCircle',
    value: function drawCircle(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 360);
      ctx.closePath();
      ctx.fillStyle = '#ccc';
      ctx.fill();
    }
  }, {
    key: 'drawLine',
    value: function drawLine(ctx, circle) {
      var dx = this.x - circle.x;
      var dy = this.y - circle.y;
      var dis = Math.sqrt(dx * dx + dy * dy);
      if (dis < 150) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(circle.x, circle.y);
        ctx.closePath();
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
      }
    }
  }, {
    key: 'move',
    value: function move(w, h) {

      this._mx = this.x < w && this.x > 0 ? this._mx : -this._mx;
      this._my = this.y < h && this.y > 0 ? this._my : -this._my;

      this.x += this._mx / 2;
      this.y += this._my / 2;
    }
  }]);

  return Circle;
}();

/*
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
*/


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var w = canvas.width = canvas.offsetWidth;
var h = canvas.height = canvas.offsetHeight;

var circles = [];

var mouseCircle = new Circle(0, 0);

var draw = function draw() {
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < circles.length; i++) {
    circles[i].move(w, h);
    circles[i].drawCircle(ctx);
    for (var j = i + 1; j < circles.length; j++) {
      circles[i].drawLine(ctx, circles[j]);
    }
  }

  if (mouseCircle.x) {
    mouseCircle.drawCircle(ctx);
    for (var k = 0; k < circles.length; k++) {
      mouseCircle.drawLine(ctx, circles[k]);
    }
  }

  requestAnimationFrame(draw);
};

var init = function init(num) {
  for (var i = 0; i < num; i++) {
    if (i < num / 2) {
      circles.push(new Circle(Math.random() * w, Math.random() * h, 'l'));
    } else {
      circles.push(new Circle(Math.random() * w, Math.random() * h, 'r'));
    }
  }
  draw();
};

window.addEventListener('load', init(60));

window.onmousemove = function (e) {
  e = e || window.event;
  mouseCircle.x = e.clientX;
  mouseCircle.y = e.clientY;
};

window.onmouseout = function (e) {
  mouseCircle.x = null;
  mouseCircle.y = null;
};