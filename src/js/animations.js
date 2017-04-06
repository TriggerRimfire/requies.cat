const $ = require('jquery') //EWW.
const { TweenMax } = require('gsap')
class Animations {
  constructor($el, maxWidth) {
    this.wrap = $el
    this.blocks = []
    this.offset = 0
    this.zoom = 10
    this.points = []
    this.scalePoints = []

    this.oldHover = null
    this.offsetException = 0
    this.maxThreshold = 1008
  }
  drawBlocksV2() {
    let id = parseInt(el.attr('data-id'))
  }
  drawBlocks() {
    console.log('test');
    let animates = [{value:0}, {value:0}, {value:0}, {value:0}, {value:0}, {value:0}, {value:0}, {value:0}]
    const canvas = this.wrap.find("[data-id='canvas']")[0]
    const canvasId = this.wrap.find("[data-id='canvas']").attr('id')
    if(canvas.getContext) {
      let mobile = false
      const ctx = canvas.getContext('2d')
      this.blocks = ['green', 'green', 'darkgreen', 'darkblue', 'darkred', 'darkgreen', 'green', 'green']
      let realWidth = canvas.width
      let blockElement = document.getElementsByClassName('blocks')
      let that = this
      this.wrap.find('.block').each(function(){
        let id = parseInt($(this).attr('data-id'))
        let animate = animates[id]

        $(this).hover(function() {
          TweenMax.to(animate,.2, {value: 2, onUpdate:function() {
            console.log(`id is ${id}`);
            update(id)
          }})
        }, function() {
          this.oldHover = id
          TweenMax.to(animate,.2, {value: 0, onUpdate: function() {
            update(id)
          }})
        })
      }) // END OF FOREACH LOOP
      function update(block) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if(realWidth <= that.maxThreshold) mobile = true
        else mobile = false
        that.points = [
          { x:0, y:that.offset }, // 0
          { x:canvas.width *.25 + that.offset, y:0 }, // 1
          { x:canvas.width *.5, y:that.offsetException }, // 2
          { x:canvas.width *.75, y:0 }, // 3
          { x:canvas.width, y:0 }, // 4
          { x:0, y:canvas.height *.5 }, // 5
          { x:canvas.width *.25, y:canvas.height *.5 + that.offset }, // 6
          { x:canvas.width *.5 + that.offsetException, y:canvas.height *.5 }, // 7
          { x:canvas.width *.75, y:canvas.height *.5 - that.offsetException }, // 8
          { x:canvas.width, y:canvas.height *.5 }, // 9
          { x:0, y:canvas.height }, // 10
          { x:canvas.width *.25 + that.offset, y:canvas.height - that.offset }, // 11
          { x:canvas.width *.5, y:canvas.height - that.offset * 2 }, // 12
          { x:canvas.width *.75 - that.offset, y:canvas.height }, // 13
          { x:canvas.width, y:canvas.height } // 14
        ]
        for (let i = 0; i < that.points.length; i++) {
          that.scalePoints[i] = {x: that.points[i].x, y: that.points[i].y}
        }
        if(typeof block !== 'undefined') {

          let index = block
          if(block > ((that.blocks.length/2)-1)) index++
          let size = animates[block].value * that.zoom
          that.scalePoints[index].x = that.scalePoints[index].x - size;
          that.scalePoints[index].y = that.scalePoints[index].y - size;

          that.scalePoints[index + 1].x = that.scalePoints[index + 1].x + size;
          that.scalePoints[index + 1].y = that.scalePoints[index + 1].y - size;

          that.scalePoints[index + 6].x = that.scalePoints[index + 6].x + size;
          that.scalePoints[index + 6].y = that.scalePoints[index + 6].y + size;

          that.scalePoints[index + 5].x = that.scalePoints[index + 5].x - size;
          that.scalePoints[index + 5].y = that.scalePoints[index + 5].y + size;
          that.scalePoints[3] = that.points[3]
          that.scalePoints[7] = that.points[7]
          that.scalePoints[8] = that.points[8]
        }
        ctx.save()
        ctx.scale( (canvas.width-40)/canvas.width, (canvas.height-40)/canvas.height)
        ctx.translate(20, 20)
        for(let i = 0; i < that.blocks.length; i++) {
          let x = i
          if(i > ((that.blocks.length/2)-1) && !mobile) x++
          if(mobile) {
            switch(i) {
              case 1: {
                x++
                break
              }
              case 3: {
                x++
                break
              }
              case 5: {
                x++
                break
              }
            }
          }
          if(canvasId === 'canvas-home' && i === 0) {
            let grd;
            if(!mobile) grd = ctx.createLinearGradient(0,0,canvas.width * .25,0)
            else grd = ctx.createLinearGradient(0,0,canvas.width * .5,0)
            grd.addColorStop(0, "green")
            grd.addColorStop(1, "green")
            ctx.fillStyle=grd
          }
          if(canvasId === 'canvas-home' && i === 1) {
            let grd;
            if(!mobile) grd = ctx.createLinearGradient(canvas.width *.25,0, canvas.width * .5, 0)
            else grd = ctx.createLinearGradient(canvas.width * .5,0,canvas.width,0)
            grd.addColorStop(0, "green")
            grd.addColorStop(0, "green")
            ctx.fillStyle=grd
          }
          else ctx.fillStyle = that.blocks[i]
          ctx.beginPath()
          if (!mobile){
            ctx.moveTo( that.scalePoints[x].x, that.scalePoints[x].y );
            ctx.lineTo( that.scalePoints[x+1].x, that.scalePoints[x+1].y  );
            ctx.lineTo( that.scalePoints[x+6].x, that.scalePoints[x+6].y );
            ctx.lineTo( that.scalePoints[x+5].x , that.scalePoints[x+5].y );
          }
          else {
            ctx.moveTo( that.scalePoints[x].x, that.scalePoints[x].y );
            ctx.lineTo( that.scalePoints[x+1].x, that.scalePoints[x+1].y  );
            ctx.lineTo( that.scalePoints[x+4].x, that.scalePoints[x+4].y );
            ctx.lineTo( that.scalePoints[x+3].x , that.scalePoints[x+3].y );
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore()
      }
      resize()
      update()
      $(window).resize(function(){
        resize()
        update()
      })
      function resize() {
        let width = that.wrap.width() + 40
        let height = that.wrap.height() + 40
        canvas.width = width
        canvas.height = height
        realWidth = width
      }
    }
  }
}
module.exports = Animations
