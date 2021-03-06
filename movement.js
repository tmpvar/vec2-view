var Vec2 = require('vec2')
var Touch = require('vec2-touch')

function isNumber(n) {
  return 'number' === typeof n
}

function isFunction (f) {
  return 'function' === typeof f
}

module.exports = function (view, canvas, opts) {

  //the example is with a canvas,
  //but this will work the same with
  //dom or svg whatever

  var rect = isFunction(canvas.getBoundingClientRect)
    ? canvas.getBoundingClientRect()
    : rect

//  if(isNumber(rect.width) && isNumber(rect.height))
//    view.view.set(rect.width, rect.height)

// if there are two touches,
// take vertical distance between them,
// remember that,
// next move, take the change in distance, and change zoom by the same amount...

  Touch(canvas, function (t) {
    t.event.preventDefault()
    var _t = t.clone(), diff = t.clone()
    console.log('ID', t.id, t.force)
    t.change(function () {
      //if you hold the shift key and drag, zoom instead of moving.

      diff.set(
        (_t.x - t.x) / view.zoom.x,
        (_t.y - t.y) / view.zoom.y
      )
      var z = _t.y - t.y
      _t.set(t)
      if(t.event.shiftKey || t.force > 0.5) {
        view.zoom.set(view.zoom.x * ((100 + z) / 100), view.zoom.y * ((100 + z) / 100))
      } else {
        view.center.add(diff)
      }
    })
  }, {})


  var keys = {
    '39': 'right',
    '37': 'left',
    '38': 'up',
    '40': 'down',
    '187': '+',
    '189': '-'
  }
  var v = new Vec2()

  window.addEventListener('keydown', function (e) {
    var motion = keys[e.keyCode]
    if(!motion) return

    var m = '+' === motion ? 1.25 : '-' === motion ? 0.8 : 0
    if(m)
      return view.zoom.set(view.zoom.x * m, view.zoom.y * m)

    if('right' === motion) v.set(1,  0)
    if('left'  === motion) v.set(-1,  0)
    if('up'    === motion) v.set( 0,  -1)
    if('down'  === motion) v.set( 0, 1)

    e.preventDefault()
    view.center.set(
      view.center.x + ((v.x*20) * 1/view.zoom.x),
      view.center.y + ((v.y*20) * 1/view.zoom.y)
    )
  })

}
