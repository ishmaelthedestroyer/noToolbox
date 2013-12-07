angular.module('bxPreventRightClick', [])

.directive 'bxPreventRightClick', ($document) ->
  (scope, element, attr) ->
    if attr.bxPreventRightClick is 'true'
      element.bind 'contextmenu', (e) ->
        scope.$apply ->
          e.preventDefault()
          e.stopPropagation()
