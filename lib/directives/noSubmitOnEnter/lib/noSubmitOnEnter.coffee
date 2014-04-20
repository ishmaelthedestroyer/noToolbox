angular.module('noSubmitOnEnter', [])

.directive 'noSubmitOnEnter', [
  () ->
    (scope, element, attr) ->
      element.bind 'keydown keypress', (e) ->
        if e.which == 13
          scope.$apply ->
            scope.$eval attr.noSubmitOnEnter

          e.preventDefault()
]

