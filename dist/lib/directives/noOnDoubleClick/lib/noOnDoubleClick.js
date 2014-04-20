angular.module('noOnDoubleClick', []).directive('noOnDoubleClick', [
  '$timeout', function($timeout) {
    return function(scope, element, attr) {
      return element.bind('click', function(e) {
        var speed;
        if (attr.noOnDoubleClickReady && attr.noOnDoubleClickReady === 'ready') {
          return scope.$apply(function() {
            element.removeAttr('noOnDoubleClickReady');
            if (attr.noOnDoubleClickReady === 'ready') {
              attr.$set('noOnDoubleClickReady', 'false');
            }
            scope.$eval(attr.noOnDoubleClick);
            return e.preventDefault();
          });
        } else {
          scope.$apply(function() {
            return attr.$set('noOnDoubleClickReady', 'ready');
          });
          speed = attr.noOnDoubleClickSpeed;
          if (speed) {
            speed = parseInt(speed);
          } else {
            speed = 200;
          }
          return $timeout(function() {
            element.removeAttr('noOnDoubleClickReady');
            if (attr.noOnDoubleClickReady === 'ready') {
              return attr.$set('noOnDoubleClickReady', 'false');
            }
          }, speed);
        }
      });
    };
  }
]);
