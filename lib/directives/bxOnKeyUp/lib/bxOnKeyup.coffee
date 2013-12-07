angular.module('bxOnKeyUp', [])

.directive 'bxOnKeyUp', ($document) ->
  (scope, element, attr) ->
    element.bind 'keyup', () ->
      scope.$apply attr.bxOnKeyUp
