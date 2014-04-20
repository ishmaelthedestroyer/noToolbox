angular.module('noRightClickMenu', [])

.directive 'noRightClickMenu', [
  '$document'
  ($document) ->
    (scope, element, attr) ->
      menu = $(attr.noRightClickMenu)
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
]