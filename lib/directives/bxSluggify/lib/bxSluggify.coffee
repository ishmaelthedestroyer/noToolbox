angular.module('bxSluggify', [])

.directive 'bxsluggify', ($document) ->
  (scope, element, attr) ->
    cb = () ->
      scope.$apply ->
        scope.$eval attr.bxsluggify

    sluggify = (text) ->
      return text.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
      .replace(/-+/g, '-')


    element.bind 'keyup', () ->
      slug = sluggify element.val() # make slug
      scope.$apply element.val slug # set slug
      cb() # fire callback
