
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

    setTimeout(() => {
      this.checkIfWin(x, y, isBlack ? 1 : 2)
    }, 0)
    
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

        // 保证了悔棋，撤销的操作的正确性
        this.history.length = this.currentStep;
        this.history.push({x, y, role: this.role});
        this.currentStep++;

        this.role = Object.is(this.role, 1) ? 2 : 1
      }
    }
  }

  checkIfWin (x, y, role) {
    if (!x || !y || !role) return;

    let count = 0

    const XVector = this.checkboard.map(x => x[y]);
    const YVector = this.checkboard[x];
    const leftVector = [];
    const rightVector = [];

    this.checkboard.forEach((vec, i) => {
      
      const leftItem = vec[y-(x-i)];
      if (leftItem !== undefined) {
        leftVector.push(leftItem)
      }

      const rightItem = vec[y+(x-i)];
      if (rightItem !== undefined) {
        rightVector.push(rightItem)
      }
    });

    [XVector, YVector, leftVector, rightVector].forEach(axis => {
      if (axis.some((x, i) => axis[i] !== 0 &&　
      axis[i-2] === axis[i-1] && axis[i-1] === axis[i] && 
      axis[i] === axis[i+1] && axis[i+1] === axis[i+2] )) {

        count++;
      }
    })

    if (count) {
      this.chessmans.onclick = null;
      this.win = true;

      alert((role == 1 ? '黑' : '白') + '子胜');
    }
  }

  retractGame () {

    if (this.history.length && !this.win) {
      const prevStep = this.history[this.currentStep - 1];
      if (prevStep) {
        const {x, y, role} = prevStep;
        const chessman = document.getElementById(`x${x}-y${y}-r${role}`);
        this.chessmans.removeChild(chessman);
        this.checkboard[x][y] = 0;
        this.currentStep--
      }
    }
  }

  revoke () {

    const next = this.history[this.currentStep];
    if (next) {
      this.drawChessmans(next.x, next.y, next.role === 1);
      this.checkboard[next.x][next.y] = next.role;
      this.currentStep++;
    }
  }
}