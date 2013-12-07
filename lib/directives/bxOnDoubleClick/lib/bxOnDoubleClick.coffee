angular.module('bxOnDoubleClick', [])

.directive 'bxOnDoubleClick', ($timeout) ->
  (scope, element, attr) ->
    element.bind 'click', (e) ->
      if attr.bxOnDoubleClick is 'ready'
        scope.$apply ->
          element.removeAttr 'bxOnDoubleClick'
          if attr.bxOnDoubleClick is 'ready'
            attr.$set 'bxOnDoubleClick', 'false'

          scope.$eval attr.bxOnDoubleClick
          e.preventDefault()
      else
        scope.$apply ->
          attr.$set 'bxOnDoubleClick', 'ready'

        speed = attr.bxOnDoubleClickSpeed
        if speed
          speed = parseInt speed
        else
          speed = 200

        $timeout ->
          element.removeAttr 'bxOnDoubleClick'
          if attr.bxOnDoubleClick is 'ready'
            attr.$set 'bxOnDoubleClick', 'false'
        , speed
