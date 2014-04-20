angular.module('noPreventRightClick', []).directive('noPreventRightClick', [
  '$document', function($document) {
    return function(scope, element, attr) {
      if (attr.noPreventRightClick === 'true') {
        return element.bind('contextmenu', function(e) {
          return scope.$apply(function() {
            e.preventDefault();
            return e.stopPropagation();
          });
        });
      }
    };
  }
]);
