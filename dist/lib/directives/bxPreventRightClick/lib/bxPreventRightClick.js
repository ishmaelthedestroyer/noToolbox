angular.module('bxPreventRightClick', []).directive('bxPreventRightClick', function($document) {
  return function(scope, element, attr) {
    if (attr.bxPreventRightClick === 'true') {
      return element.bind('contextmenu', function(e) {
        return scope.$apply(function() {
          e.preventDefault();
          return e.stopPropagation();
        });
      });
    }
  };
});
