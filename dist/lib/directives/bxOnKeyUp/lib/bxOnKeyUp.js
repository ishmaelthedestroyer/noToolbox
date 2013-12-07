angular.module('bxOnKeyUp', []).directive('bxOnKeyUp', function($document) {
  return function(scope, element, attr) {
    return element.bind('keyup', function() {
      return scope.$apply(attr.bxOnKeyUp);
    });
  };
});
