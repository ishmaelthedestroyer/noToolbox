angular.module('bxSluggify', [])

.directive 'bxSluggify', ($document) ->
  (scope, element, attr) ->
    sluggify = (text) ->
      return text.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    element.bind 'keyup', () ->
      slug = sluggify element.val()
      scope.$apply element.val slug
