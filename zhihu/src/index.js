
class Circle {
  constructor (x, y, type) {
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

  drawCircle(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    ctx.fillStyle = '#ccc';
    ctx.fill();
  }

  drawLine(ctx, circle) {
    const dx = this.x - circle.x;
    const dy = this.y - circle.y;
    const dis = Math.sqrt(dx * dx + dy * dy);
    if (dis < 150) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(circle.x, circle.y);
      ctx.closePath();
      ctx.strokeStyle = '#ccc';
      ctx.stroke();
    } 
  }

  move(w, h) {
    
    this._mx = (this.x < w && this.x > 0) ? this._mx : -this._mx;
    this._my = (this.y < h && this.y > 0) ? this._my : -this._my;
    
    this.x += this._mx / 2;
    this.y += this._my / 2;
  } 
}

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

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width  = canvas.offsetWidth;
const h = canvas.height = canvas.offsetHeight;

const circles = [];

const mouseCircle =  new Circle(0, 0);

const draw = function () {
  ctx.clearRect(0, 0, w, h);
  for (var i=0; i< circles.length; i++) {
    circles[i].move(w, h);
    circles[i].drawCircle(ctx);
    for (var j = i + 1; j < circles.length; j++) {
      circles[i].drawLine(ctx, circles[j])
    }
  }

  if (mouseCircle.x) {
    mouseCircle.drawCircle(ctx);
    for(var k=0; k<circles.length; k++){
      mouseCircle.drawLine(ctx, circles[k]);
    }
  }

  requestAnimationFrame(draw)
}

const init = function (num) {
  for (var i=0; i<num; i++) {
    if(i < num/2) {
      circles.push(new Circle(Math.random() * w, Math.random() * h, 'l'));
    } else {
      circles.push(new Circle(Math.random() * w, Math.random() * h, 'r'));
    }
  }
  draw();
}


window.addEventListener('load', init(60));

window.onmousemove = function (e) {
  e = e || window.event;
  mouseCircle.x = e.clientX;
  mouseCircle.y = e.clientY;
}

window.onmouseout = function (e) {
  mouseCircle.x = null;
  mouseCircle.y = null;
}