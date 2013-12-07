angular.module 'bxAnimateToCenter', [])

.directive 'bxAnimateToCenter', ($window) ->
  (scope, element, attr) ->

    speed = parseInt attr.animatespeed || 1000
    offsetx = parseInt attr.animateoffsetx || 0
    offsety = parseInt attr.animateoffsety || 0
    x = ($window.innerHeight / 2) - (element.height() / 2) + offsetx
    y = ($window.innerWidth / 2) - (element.width() / 2) + offsety

    console.log 'params: ' + offsetx + ',' + offsety + ',' + speed

    w = attr.animatetowidth || element.width()
    h = attr.animatetoheight || element.height()

    element.css
      left: 0 + 'px'
      top: 0 + 'px'
      width: 0 + 'px'
      height: 0 + 'px'

    element.animate
      top: x + 'px'
      left: y + 'px'
      width: w + 'px'
      height: h + 'px'
    , speed, () ->
      element.removeAttr 'bxAnimateToCenter'
