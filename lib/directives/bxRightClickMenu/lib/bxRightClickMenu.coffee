angular.module('bxRightClickMenu', [])

.directive 'bxRightClickMenu', ($document) ->
  (scope, element, attr) ->
    menu = $(attr.bxRightClickMenu)
    menu.css
      position: 'fixed'

    element.bind 'contextmenu', (e) ->
      scope.$apply ->
        e.preventDefault()
        e.stopPropagation()

        x = e.clientX
        y = e.clientY

        menu.css
          left: x + 'px'
          top: y + 'px'

        menu.find('.dropdown-toggle').dropdown('toggle')
