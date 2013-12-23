angular.module('bxSluggify', []).directive('bxsluggify', function($document, $parse) {
  return function(scope, element, attr) {
    var cb, ngModel, sluggify, value;
    ngModel = $parse($attrs['ngModel']);
    value = $parse($attrs['ngValue'])($scope);
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
      if (attrs['ngModel']) {
        $scope.$apply(function() {
          return ngModel.assign($scope, slug);
        });
      }
      return cb();
    });
  };
});
