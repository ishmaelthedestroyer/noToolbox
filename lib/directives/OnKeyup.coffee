app.directive 'onkeyup', ($document) ->
  (scope, element, attr) ->
    element.bind 'keyup', () ->
      scope.$apply attr.onKeyup
