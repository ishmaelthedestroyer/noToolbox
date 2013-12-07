angular.module('bxSubmitOnEnter', [])

.directive 'bxSubmitOnEnter', () ->
  (scope, element, attr) ->
    element.bind 'keydown keypress', (e) ->
      if e.which == 13
        scope.$apply ->
          scope.$eval attr.bxSubmitOnEnter

        e.preventDefault()
