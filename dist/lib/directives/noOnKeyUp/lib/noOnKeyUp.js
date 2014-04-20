angular.module('noOnKeyUp', []).directive('noOnKeyUp', [
  '$document', function($document) {
    return function(scope, element, attr) {
      return element.bind('keyup', function() {
        return scope.$apply(attr.noOnKeyUp);
      });
    };
  }
]);
