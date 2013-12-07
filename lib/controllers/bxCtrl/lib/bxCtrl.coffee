angular.module('bxCtrl', ['bxNotify', 'bxQueue', 'bxSession'])

.controller 'bxCtrl', [
  '$scope', '$rootScope', '$q', 'bxNotify', 'bxQueue', 'bxSession', 'bxLogger'
  ($scope, $rootScope, $q, Notify, Queue, Session, Logger) ->
    Notify.setScope $scope
    Queue.setScope $scope
    session = {}

    $scope.notifications = Notify.list()
    $scope.queue = Queue.list()

    $scope.removeNotification = (index) ->
      Notify.remove index

    do ->
      # add session request to queue, fetch session
      deferred = $q.defer()
      Queue.push deferred.promise

      Session.refresh().then (data) ->
        deferred.resolve true

    $rootScope.$on 'session:loaded', (event, data) ->
      Logger.debug 'Updated session.', data
      session = data

    apply = (scope, fn) ->
      if scope.$$phase or scope.$root.$$phase
        fn()
      else
        scope.$apply fn
]
