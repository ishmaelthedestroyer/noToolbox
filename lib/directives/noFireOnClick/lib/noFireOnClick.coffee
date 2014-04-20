angular.module('noFireOnClick', [])

.directive 'noFireOnClick', [
  () ->
    (scope, element, attr) ->
      func = (e) ->
        scope.$apply ->
          scope.$eval attr.noFireOnClick
          e.preventDefault()

      element.bind 'contextmenu' , func
      element.bind 'click',  func
]