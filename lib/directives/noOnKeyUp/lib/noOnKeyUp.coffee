angular.module('noOnKeyUp', [])

.directive 'noOnKeyUp', [
  '$document'
  ($document) ->
    (scope, element, attr) ->
      element.bind 'keyup', () ->
        scope.$apply attr.noOnKeyUp
]