app.directive 'fireonclick', () -> # TODO: rename directive, add left click
  (scope, element, attr) ->
    func = (e) ->
      scope.$apply ->
        scope.$eval attr.fireonclick
        e.preventDefault()

    element.bind 'contextmenu' , func
    element.bind 'click',  func
