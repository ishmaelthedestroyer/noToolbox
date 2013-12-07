app.directive 'ondoubleclick', ($timeout) ->
  (scope, element, attr) ->
    element.bind 'click', (e) ->
      if attr.ondoubleclickready is 'ready'
        scope.$apply ->
          element.removeAttr 'ondoubleclickready'
          if attr.ondoubleclickready is 'ready'
            attr.$set 'ondoubleclickready', 'false'

          scope.$eval attr.ondoubleclick
          e.preventDefault()
      else
        scope.$apply ->
          attr.$set 'ondoubleclickready', 'ready'

        speed = attr.ondoubleclickspeed
        if speed
          speed = parseInt speed
        else
          speed = 200

        $timeout ->
          element.removeAttr 'ondoubleclickready'
          if attr.ondoubleclickready is 'ready'
            attr.$set 'ondoubleclickready', 'false'
        , speed
