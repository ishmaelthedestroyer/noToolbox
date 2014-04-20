angular.module('noPreventRightClick', [])

.directive 'noPreventRightClick', [
  '$document'
  ($document) ->
    (scope, element, attr) ->
      if attr.noPreventRightClick is 'true'
        element.bind 'contextmenu', (e) ->
          scope.$apply ->
            e.preventDefault()
            e.stopPropagation()
]