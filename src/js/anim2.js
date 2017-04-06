const $ = require('jquery')
const { TweenMax } = require('gsap')
const Point = require('./framework/Point')
const Block = require('./framework/Block')
const animation = require('./framework/Animation')
const _ = require('underscore')

class Anim2 {
  constructor(el) {
    _.bindAll(this, "update")
    this.canvas = $("canvas").get(0)
    console.log(this.canvas);
    this.canvasId = $(this.canvas).attr('id')
    this.ctx = this.canvas.getContext('2d')
    this.rafId = null
    this.animating = false
    this.canvasScale = 1
    this.timeout = null
    this.intro = false
    this.blockColors = [
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'},
      {desktop: 'green', mobile: 'green'}
    ]
    this.blocks = []
    this.resetPoints = []
    this.currentPoints = []
    this.animations = []
    this.scale = 10 / 1024
    this.zoom = 20
    this.build()
  }
  build() {
    let hparts = 4 + 1
    let vparts = 2 + 1
    let hoffset = 1 / 4
    let voffset = 1 / 2
    this.resetPoints = []
    this.animations = []
    this.currentPoints = []
    for(let y = 0; y < vparts; y++) {
      for(let x = 0; x < hparts; x++) {
        let point = new Point(hoffset * x, voffset * y)
        if(this.offsets) {
          point.offsetPoint(this.offsets[this.resetPoints.length])
          this.resetPoints.push(point)
          this.currentPoints.push(point.clone())
          this.animations.push(animation.create(this.currentPoints[this.currentPoints.length -1], true))
        }
      }
    }
    this.blocks = []
    let count
    for(let i = 0, count = this.cols * this.rows; i < count; i++) {
      let col = i % this.cols
      let row = Math.floor(i / this.cols)
      let lt = row * hparts + col
      let rt = lt + 1
      let lb = (row + 1) * hparts + col
      let rb = lb + 1
      this.blocks.push(new Block(lt, rt, rb, lb, this.blockColors[i]))
    }
  }
  startAnimation() {
    if(!this.animating) this.update()
  }
  onRollOverBlock(e) {
    let id = parseInt($(e.currentTarget).attr('data-id'))
    let block = this.blocks[id]
    let opts = {duration: 200, ease: 'easeOutCubic', queue:false}
    this.animations[block.lt].stop().to(this.resetPoints[block.lt].clone().offset(-this.scale, -this.scale), opts)
    this.animations[block.rt].stop().to(this.resetPoints[block.rt].clone().offset(this.scale, -this.scale), opts)
    this.animations[block.rb].stop().to(this.resetPoints[block.rb].clone().offset(this.scale, this.scale), opts)
    this.animations[block.lb].stop().to(this.resetPoints[block.lb].clone().offset(-this.scale, this.scale), opts)
    this.startAnimation()
  }
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    this.ctx.scale((this.canvas.width - 40 * this.canvasScale) / this.canvas.width, (this.canvas.height - 40 * this.canvasScale) / this.canvas.height)
    this.ctx.translate(20 * this.canvasScale, 20 * this.canvasScale)

    _.each(this.blocks, (block) => {
      let lt = this.animations[block.lt].update().values()
      let rt = this.animations[block.rt].update().values()
      let rb = this.animations[block.rb].update().values()
      let lb = this.animations[block.lb].update().values()
      this.ctx.fillStyle = block.color['desktop']
      this.ctx.beginPath()
      this.ctx.moveTo(lt.x * this.canvas.width, lt.y * this.canvas.height)
      this.ctx.lineTo(rt.x * this.canvas.width, rt.y * this.canvas.height)
      this.ctx.lineTo(rb.x * this.canvas.width, rb.y * this.canvas.height)
      this.ctx.lineTo(lb.x * this.canvas.width, lb.y * this.canvas.height)
      this.ctx.closePath()
      this.ctx.fill()
    }, this)
    ctx.restore()
    this.animating = _.some(this.animations, (animation) => {
      return !animation.isFinished()
    })
    if(this.animating) this.rafId = animation.requestAnimationFrame(this.update)
    else this.rafId = null
  }
}
module.exports = Anim2
