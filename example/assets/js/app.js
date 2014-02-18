var app = angular.module('App', ['ui.router', 'ui.bootstrap', 'noToolbox'])

app.controller('AppCtrl', [
  '$scope', '$state', '$q', 'noResource', 'noNotify', 'noQueue', 'noLogger',
  function($scope, $state, $q, Resource, Notify, Queue, Logger) {
  }
]);

angular.element(document).ready(function() {
  return angular.bootstrap(document, ['App']);
});