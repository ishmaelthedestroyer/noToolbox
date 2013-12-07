angular.module('bxCtrl', [])
.controller 'bxCtrl', [
  '$scope', '$rootScope', '$q', 'bxNotify', 'bxQueue', 'bxSession'
  ($scope, $rootScope, $q, Notify, Queue, Session) ->
    Notify.setScope $scope
    Queue.setScope $scope
    session = null

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

    $rootScope.$on 'Session:loaded', (event, data) -> session = data

    apply = (scope, fn) ->
      if scope.$$phase or scope.$root.$$phase
        fn()
      else
        scope.$apply fn
]
