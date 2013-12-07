angular.module('bxFireOnClick', [])

.directive 'bxFireOnClick', () ->
  (scope, element, attr) ->
    func = (e) ->
      scope.$apply ->
        scope.$eval attr.fireonclick
        e.preventDefault()

    element.bind 'contextmenu' , func
    element.bind 'click',  func
