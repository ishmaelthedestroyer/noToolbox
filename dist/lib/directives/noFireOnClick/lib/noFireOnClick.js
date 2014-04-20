angular.module('noFireOnClick', []).directive('noFireOnClick', [
  function() {
    return function(scope, element, attr) {
      var func;
      func = function(e) {
        return scope.$apply(function() {
          scope.$eval(attr.noFireOnClick);
          return e.preventDefault();
        });
      };
      element.bind('contextmenu', func);
      return element.bind('click', func);
    };
  }
]);
