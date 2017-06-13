
class GoBang {

  constructor (options) {
    this.options = options;
    this.gobang = document.getElementById(options.selector);
    this.chessboard = this.gobang.children[0];
    this.chessmans = this.gobang.children[1];

    this.style = Object.assign({
      padding: 20,
      count: 20
    }, options.style);

    this.grid = {
      width: (this.gobang.clientWidth - this.style.padding * 2) / this.style.count,
      height: (this.gobang.clientHeight - this.style.padding * 2) / this.style.count
    }

    this.init()
  }

  init () {

    this.role = 2;

    this.history = [];
    this.currentStep = 0;

    this.drawChessboard();
    this.initChessMatrix();
    this.listenChessman();
  }

  initChessMatrix () {
    
    const checkboard = [];
    for (let x=0; x < this.style.count + 1; x++) {
      checkboard[x] = [];
      for (let y=0; y < this.style.count + 1; y++) {
        checkboard[x][y] = 0;
      }
    }
    this.checkboard = checkboard;
  }

  drawChessboard () {

    const grids = Array.from({
      length: this.style.count * this.style.count
    }, () => `<span class="grid"></span>`)

    this.chessboard.innerHTML = grids.join('');
    this.chessboard.className = `chessboard grid-${this.style.count}`;
    this.gobang.style.border = `${this.style.padding}px solid #eee`
  }

  drawChessmans (x, y, isBlack) {

    const chessman = document.createElement('div');
    chessman.setAttribute('id', `x${x}-y${y}-r${isBlack ? 1 : 2}`);
    chessman.className = isBlack ? 'chessman black' : 'chessman white';
    chessman.style.width = this.grid.width * 0.5;
    chessman.style.height = this.grid.height * 0.5;
    chessman.style.left = (x * this.grid.width) - this.grid.width * 0.25;
    chessman.style.top = (y * this.grid.height) - this.grid.height * 0.25; 
    this.chessmans.appendChild(chessman)
  }
  
  listenChessman () {

    this.chessmans.onclick = event => {
      if (event.target.className.includes('chessman ')) {
        return false;
      }

      let {offsetX: x, offsetY: y} = event;
      x = Math.round(x / this.grid.width);
      y = Math.round(y / this.grid.height);

      const effectiveBoard = !!this.checkboard[x];
      if (effectiveBoard && this.checkboard[x][y] !== undefined && Object.is(this.checkboard[x][y], 0)) {
        this.checkboard[x][y] = this.role
        this.drawChessmans(x, y, Object.is(this.role, 1))

        this.history.length = this.currentStep;
        this.history.push({x, y, role: this.role});
        this.currentStep++;

        this.role = Object.is(this.role, 1) ? 2 : 1
      }
    }
  }

  checkIfWin () {
    
  }
}