app.directive 'submitonenter', () ->
  (scope, element, attr) ->
    element.bind 'keydown keypress', (e) ->
      if e.which == 13
        scope.$apply ->
          scope.$eval attr.submitonenter

        e.preventDefault()
