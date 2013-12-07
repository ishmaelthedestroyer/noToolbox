angular.module('bxCtrl', ['bxNotify', 'bxQueue', 'bxSession']).controller('bxCtrl', [
  '$scope', '$rootScope', '$q', 'bxNotify', 'bxQueue', 'bxSession', 'bxLogger', function($scope, $rootScope, $q, Notify, Queue, Session, Logger) {
    var apply;
    Notify.setScope($scope);
    Queue.setScope($scope);
    $scope.session = {};
    $scope.notifications = Notify.list();
    $scope.queue = Queue.list();
    $scope.removeNotification = function(index) {
      return Notify.remove(index);
    };
    (function() {
      var deferred;
      deferred = $q.defer();
      Queue.push(deferred.promise);
      return Session.refresh().then(function(data) {
        return deferred.resolve(true);
      });
    })();
    $rootScope.$on('session:loaded', function(event, data) {
      Logger.debug('Updated session.', data);
      return $scope.session = data;
    });
    return apply = function(scope, fn) {
      if (scope.$$phase || scope.$root.$$phase) {
        return fn();
      } else {
        return scope.$apply(fn);
      }
    };
  }
]);
