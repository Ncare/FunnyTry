//window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

class Meteor {

  constructor(options) {
    this.options = options
    this.meteor = document.getElementById(options.selector || 'canvas')

    this.canvas = document.createElement('canvas')
    this.meteor.appendChild(this.canvas)

    this.canvas.width = this.meteor.offsetWidth
    this.canvas.height = this.meteor.offsetHeight

    this.rect = {
      width: this.canvas.width,
      height: this.canvas.height
    }
    this.context = this.canvas.getContext('2d')

    this.stars = []
    this.meteors = []

    this.init()

  }

  init() {

    this.drawStars()

    setInterval(() => { this.starAnimate() }, 200)

    this.drawMeteor()
    
    setInterval(() => { this.meteorAnimate() }, 20)
  }

  drawStars() {
    for (var i = 0; i < 300; i++) {
      const star = new Star(this.rect)
      star.draw(this.context)

      this.stars.push(star)
    }
  }

  drawMeteor () {
    for (var i=0; i< 20; i++) {
      const meteor = new MeteorRain(this.rect)
      meteor.draw(this.context)

      this.meteors.push(meteor)
    }
  }

  starAnimate() {
    for (var i=0; i<this.stars.length; i++) {
      this.stars[i].getRandomColor()
      this.stars[i].draw(this.context)
    }
    
  }

  meteorAnimate() {
    for(var i=0; i<this.meteors.length; i++) {
      this.meteors[i].move(this.context)
      if (this.meteors[i].y > this.rect.height + 100)　{
        
        const meteor = new MeteorRain(this.rect)
        meteor.draw(this.context)
        this.meteors[i] = meteor
      }
    }
  }
}

class Star {

  constructor(rect) {
    this.x = rect.width * Math.random()
    this.y = rect.height * Math.random()
    this.getRandomColor()
  }

  getRandomColor() {
    var random = Math.random()

    if (random < 0.5) {
      this.color = 'gray'
    } else {
      this.color = 'white'
    }
  }

  draw(context) {
    context.beginPath()
    context.arc(this.x, this.y, 0.05, 0, 2 * Math.PI)
    context.strokeStyle = this.color
    context.stroke()
    context.closePath()
  }
}

class MeteorRain {

  constructor (rect) {
    this.alpha = 1
    this.angle = 30 + Math.random() * 5
    this.speed = Math.ceil(Math.random() + 0.5) * 10

    const x = Math.random() * 80 + 100
    var cos = Math.cos(this.angle * 3.14/180)
    var sin = Math.sin(this.angle * 3.14/180)

    this.length = Math.ceil(x)

    this.width = this.length * cos
    this.height = this.length * sin

    this.offset_x = this.speed * cos 
    this.offset_y = this.speed * sin 

    // 画布的大小
    this.rect = rect

    this.getPos()
  }

  computePos () {
    this.x = this.x - this.offset_x
    this.y = this.y + this.offset_y
  }

  getPos () {
    this.x = this.rect.width * Math.random()
    this.y = this.rect.height * Math.random()
  }

  draw (context) {
    context.save()
    context.beginPath()
    context.lineWidth = 2.5
    context.globalAlpha = this.alpha

    let line = context.createLinearGradient(this.x, this.y, this.x + this.width, this.y - this.height)
    line.addColorStop(0, 'rgba(255, 255, 255, 1)')
    line.addColorStop(1, 'rgba(255, 255, 255, 0)')

    if(this.alpha < 0) {
      this.alpha = - this.alpha
    }

    context.strokeStyle = line
    context.moveTo(this.x, this.y)
    context.lineTo(this.x+this.width, this.y - this.height)

    context.closePath()
    context.stroke()
    context.restore()
  }

  move (context) {
    let x = this.x + this.width - this.offset_x;
    let y = this.y - this.height

    this.alpha -= 0.02

    this.computePos()

    
    context.clearRect(this.x-this.offset_x, y, this.width+this.offset_x, this.height)
    

    this.draw(context)
  }
}