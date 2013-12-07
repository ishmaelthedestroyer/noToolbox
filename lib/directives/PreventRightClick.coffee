app.directive 'preventrightclick', ($document) ->
  (scope, element, attr) ->
    if attr.preventrightclick == 'true'
      element.bind 'contextmenu', (e) ->
        scope.$apply ->
          e.preventDefault()
          e.stopPropagation()
