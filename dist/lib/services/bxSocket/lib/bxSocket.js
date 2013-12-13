angular.module('bxSocket', []).service('bxSocket', [
  '$rootScope', '$http', '$q', '$timeout', 'bxLogger', function($rootScope, $http, $q, $timeout, Logger) {
    var apply, host, initialized, load, open, scope, socket;
    scope = null;
    socket = null;
    initialized = false;
    open = false;
    host = location.protocol + '//' + location.hostname;
    if (location.port) {
      host += ':' + location.port;
    }
    load = function(url) {
      var deferred, promise, sio, wait, _s;
      deferred = $q.defer();
      promise = deferred.promise;
      if (window.io) {
        deferred.resolve(true);
        return promise;
      }
      sio = document.createElement('script');
      sio.type = 'text/javascript';
      sio.async = true;
      sio.src = url || '/socket.io/socket.io.js';
      _s = document.getElementsByTagName('script')[0];
      _s.parentNode.insertBefore(sio, _s);
      wait = function() {
        return setTimeout(function() {
          if (window.io) {
            return deferred.resolve(true);
          }
          return wait();
        }, 50);
      };
      wait();
      return promise;
    };
    apply = function(scope, fn) {
      if (scope.$$phase || scope.$root.$$phase) {
        return fn();
      } else {
        return scope.$apply(fn);
      }
    };
    return {
      get: function() {
        return socket;
      },
      isOpen: function() {
        return open;
      },
      setScope: function(s) {
        return scope = s;
      },
      emit: function(e, data, cb) {
        if (!socket || !open) {
          throw new Error('Socket closed!');
          return false;
        }
        return socket.emit(e, data, function() {
          return apply(scope || $rootScope, function() {
            return cb && cb();
          });
        });
      },
      on: function(e, cb) {
        socket.removeListener(e, cb);
        return socket.on(e, function(data) {
          return apply(scope || $rootScope, function() {
            return cb && cb(data);
          });
        });
      },
      isListening: function(e, cb) {
        var func, listeners, _i, _len;
        listeners = socket.listeners(e);
        if (!listeners) {
          return false;
        }
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          func = listeners[_i];
          if (cb === func) {
            return true;
          }
        }
        return false;
      },
      removeListener: function(e, cb) {
        return socket.removeListener(e, cb);
      },
      removeAllListeners: function() {
        return socket.removeAllListeners();
      },
      close: function() {
        if (socket) {
          socket.disconnect();
          return open = false;
        }
      },
      open: function(url, wait) {
        var deferred, promise;
        deferred = $q.defer();
        if (open) {
          promise = deferred.promise;
          deferred.resolve(true);
          return promise;
        }
        return load(url).then(function() {
          var count, delay, timedOut, waiting;
          waiting = false;
          timedOut = false;
          delay = 0;
          count = function(max, deferred) {
            Logger.debug('Counting to ' + max + '... currently at ' + delay + '...');
            return $timeout(function() {
              if (!waiting) {
                return false;
              }
              if (++delay >= max) {
                timedOut = true;
                Logger.error('Socket.open() request timed out.');
                deferred.reject(null);
                return false;
              } else {
                return count(max, deferred);
              }
            }, 1000);
          };
          if (!initialized) {
            socket = io.connect(host);
            initialized = true;
          } else {
            deferred.resolve(true);
            socket.socket.connect();
          }
          waiting = true;
          count(wait || 10, deferred);
          socket.on('server:handshake', function(data) {
            if (timedOut) {
              return false;
            }
            delay = 0;
            open = true;
            waiting = false;
            Logger.info('Handshake successful.');
            return deferred.resolve(data);
          });
          return deferred.promise;
        });
      }
    };
  }
]);
