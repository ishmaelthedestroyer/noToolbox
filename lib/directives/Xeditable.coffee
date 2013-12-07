app.directive 'xeditable', () ->
  (scope, element, attr) ->
    console.log attr.id

    editable = document.createElement 'span'
    editable.style.display = 'none'
    element.append editable

    $(editable).editable
      type: 'text'
      title: 'Rename'
      success: (response, val) ->
        console.log 'Got response.',
          response: response
          val: val

    setTimeout ->
      $(editable).editable('toggle')
    , 1000
