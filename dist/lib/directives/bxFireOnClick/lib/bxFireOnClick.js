angular.module('bxFireOnClick', []).directive('bxFireOnClick', function() {
  return function(scope, element, attr) {
    var func;
    func = function(e) {
      return scope.$apply(function() {
        scope.$eval(attr.fireonclick);
        return e.preventDefault();
      });
    };
    element.bind('contextmenu', func);
    return element.bind('click', func);
  };
});
