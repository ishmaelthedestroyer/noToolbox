angular.module('bxOnDoubleClick', []).directive('bxOnDoubleClick', function($timeout) {
  return function(scope, element, attr) {
    return element.bind('click', function(e) {
      var speed;
      if (attr.bxOnDoubleClick === 'ready') {
        return scope.$apply(function() {
          element.removeAttr('bxOnDoubleClick');
          if (attr.bxOnDoubleClick === 'ready') {
            attr.$set('bxOnDoubleClick', 'false');
          }
          scope.$eval(attr.bxOnDoubleClick);
          return e.preventDefault();
        });
      } else {
        scope.$apply(function() {
          return attr.$set('bxOnDoubleClick', 'ready');
        });
        speed = attr.bxOnDoubleClickSpeed;
        if (speed) {
          speed = parseInt(speed);
        } else {
          speed = 200;
        }
        return $timeout(function() {
          element.removeAttr('bxOnDoubleClick');
          if (attr.bxOnDoubleClick === 'ready') {
            return attr.$set('bxOnDoubleClick', 'false');
          }
        }, speed);
      }
    });
  };
});
