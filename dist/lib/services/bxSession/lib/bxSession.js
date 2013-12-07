angular.module('bxSession.session', []).service('bxSession', [
  '$rootScope', '$http', '$q', function($rootScope, $http, $q) {
    var api, authenticated, loadSession, onError, scope, session, update;
    session = null;
    authenticated = false;
    scope = $rootScope;
    onError = function() {
      session = null;
      return authenticated = false;
    };
    api = {
      login: '/api/login',
      logout: '/api/logout',
      signup: '/api/signup',
      session: '/api/session'
    };
    loadSession = function(override) {
      var deferred, promise;
      deferred = $q.defer();
      promise = deferred.promise;
      if (!session || override) {
        $http.get(api.session).success(function(data, status, headers, config) {
          return update('loaded', function() {
            session = data;
            return deferred.resolve(data);
          });
        }).error(function(data, status, headers, config) {
          return update('error', function() {
            onError && onError();
            return deferred.reject({});
          });
        });
      } else {
        deferred.resolve(session);
      }
      return promise;
    };
    update = function(emit, fn) {
      if (scope.$$phase || scope.$root.$$phase) {
        fn();
      } else {
        scope.$apply(fn);
      }
      scope.$emit('session:' + emit, session);
      scope.$emit('session:loaded' + session);
      return {
        config: function(options) {
          var err;
          if (options.login) {
            api.login = options.login;
          }
          if (options.logout) {
            api.logout = options.logout;
          }
          if (options.signup) {
            api.signup = options.signup;
          }
          if (options.session) {
            api.session = options.session;
          }
          if (options.scope) {
            scope = options.scope;
          }
          if (options.onError) {
            if (typeof options.onError !== 'function') {
              return err = new Error('bxSession.config() requires ' + 'options.onError to be typeof == function');
            } else {
              return onError = options.onError;
            }
          }
        }
      };
    };
    return {
      load: function() {
        return loadSession(false);
      },
      refresh: function() {
        return loadSession(true);
      },
      isAuthenticated: function() {
        return authenticated;
      },
      login: function(username, password) {
        var deferred;
        deferred = $q.defer();
        $http.post(api.login, {
          username: username,
          password: password
        }).success(function(data, status, headers, config) {
          return update('login', function() {
            session = data;
            authenticated = true;
            return deferred.resolve(true);
          });
        }).error(function(data, status, headers, config) {
          return update('error', function() {
            onError && onError();
            return deferred.reject(false);
          });
        });
        return deferred.promise;
      },
      signup: function(username, password) {
        var deferred;
        deferred = $q.defer();
        $http.post(api.signup, {
          username: username,
          password: password
        }).success(function(data, status, headers, config) {
          return update('signup', function() {
            update = data;
            authenticated = true;
            return deferred.resolve(true);
          });
        }).error(function(data, status, headers, config) {
          return update('error', function() {
            onError && onError();
            return deferred.reject(false);
          });
        });
        return deferred.promise;
      },
      logout: function() {
        var deferred;
        deferred = $q.defer();
        $http.get(api.logout).success(function(data, status, headers, config) {
          return update('logout', function() {
            session = null;
            authenticated = false;
            return deferred.resolve(true);
          });
        }).error(function(data, status, headers, config) {
          return update('error', function() {
            onError && onError();
            return deferred.reject(false);
          });
        });
        return deferred.promise;
      }
    };
  }
]);

angular.module('bxSession.auth', ['bxSession.session']).provider('bxAuth', function() {
  var $q, $state, bxSession, util;
  util = null;
  bxSession = null;
  $state = null;
  $q = null;
  this.auth = function(options) {
    return function() {
      var authKey, deferred, err, redirAuth, reqAuth;
      if (!util || !bxSession || !$state || !$q) {
        err = new Error('bxAuth dependencies not initialized.');
        console.log('ERROR! bxAuth not initialized.', err);
        throw err;
        return null;
      }
      if (!('authKey' in options)) {
        throw new Error('bxAuth requires options.authKey ' + 'in the options object');
      } else if (!('reqAuth' in options)) {
        throw new Error('bxAuth requires options.reqAuth ' + 'in the options object');
      } else if (!('redirAuth' in options)) {
        throw new Error('bxAuth requires options.redirAuth ' + 'in the options object');
      }
      authKey = options.authKey;
      reqAuth = options.reqAuth;
      redirAuth = options.redirAuth;
      deferred = $q.defer();
      bxSession.load().then(function(session) {
        if (reqAuth) {
          if ((session == null) || typeof session !== 'object' || !(authKey in session)) {
            deferred.reject(null);
            if ($state.current.name !== reqAuth) {
              console.log('Page req auth. User not auth. Redirect to ');
              return $state.go(reqAuth);
            } else {
              console.log('Page req auth. User already on page.' + ' Generating  random token.');
              return $state.go(redirAuth, {
                redirect: util.random(15)
              });
            }
          } else {
            return deferred.resolve(true);
          }
        } else if (redirAuth) {
          if (session && Object.getOwnPropertyNames(session).length) {
            deferred.reject(null);
            console.log('Redirecting auth user.');
            if ($state.current.name !== redirAuth) {
              return $state.go(redirAuth);
            } else {
              console.log('Redirecting auth users. Already on redir.' + ' Generating random token.');
              return $state.go(redirAuth, {
                redirect: util.random(15)
              });
            }
          } else {
            return deferred.resolve(true);
          }
        } else {
          return deferred.resolve(true);
        }
      });
      return deferred.promise;
    };
  };
  this.$get = function() {
    return {
      bootstrap: function(_state, _q, _bxSession, _util) {
        bxSession = _bxSession;
        $state = _state;
        $q = _q;
        return util = _util;
      }
    };
  };
  return this;
});

angular.module('bxSession', ['ui.router', 'bxSession.auth', 'bxUtil']).run([
  '$rootScope', '$state', '$http', '$q', 'bxAuth', 'bxSession', 'bxUtil', function($rootScope, $state, $http, $q, bxAuth, bxSession, bxUtil) {
    return bxAuth.bootstrap($state, $q, bxSession, bxUtil);
  }
]);
