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
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.stars = []
    this.meteors = []

    this.init()
  }

  init() {

    this.drawStars()
    //this.drawMeteor()

    setInterval(() => { this.starAnimate() }, 200)
    
    //this.meteorAnimate()
  }

  drawStars() {
    for (var i = 0; i < 300; i++) {
      const star = new Star(this.rect)
      star.draw(this.context)

      this.stars.push(star)
    }
  }

  starAnimate() {
    for (var i=0; i<this.stars.length; i++) {
      this.stars[i].getRandomColor()
      this.stars[i].draw(this.context)
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