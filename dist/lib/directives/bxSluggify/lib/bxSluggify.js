angular.module('bxSluggify', []).directive('bxSluggify', function($document) {
  return function(scope, element, attr) {
    var sluggify;
    sluggify = function(text) {
      return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    };
    return element.bind('keyup', function() {
      var slug;
      slug = sluggify(element.val());
      return scope.$apply(element.val(slug));
    });
  };
});
