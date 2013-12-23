angular.module('bxSluggify', []).directive('bxsluggify', function($document) {
  return function(scope, element, attr) {
    var cb, sluggify;
    cb = function() {
      return scope.$apply(function() {
        return scope.$eval(attr.bxsluggify);
      });
    };
    sluggify = function(text) {
      return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    };
    return element.bind('keyup', function() {
      var slug;
      slug = sluggify(element.val());
      scope.$apply(element.val(slug));
      return cb();
    });
  };
});
