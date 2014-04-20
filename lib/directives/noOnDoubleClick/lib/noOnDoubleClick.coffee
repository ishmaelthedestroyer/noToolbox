angular.module('noOnDoubleClick', [])

.directive 'noOnDoubleClick', [
  '$timeout'
  ($timeout) ->
    (scope, element, attr) ->
      element.bind 'click', (e) ->
        if attr.noOnDoubleClickReady and attr.noOnDoubleClickReady is 'ready'
          scope.$apply ->
            element.removeAttr 'noOnDoubleClickReady'
            if attr.noOnDoubleClickReady is 'ready'
              attr.$set 'noOnDoubleClickReady', 'false'

            scope.$eval attr.noOnDoubleClick
            e.preventDefault()
        else
          scope.$apply ->
            attr.$set 'noOnDoubleClickReady', 'ready'

          speed = attr.noOnDoubleClickSpeed
          if speed
            speed = parseInt speed
          else
            speed = 200

          $timeout ->
            element.removeAttr 'noOnDoubleClickReady'
            if attr.noOnDoubleClickReady is 'ready'
              attr.$set 'noOnDoubleClickReady', 'false'
          , speed
]

