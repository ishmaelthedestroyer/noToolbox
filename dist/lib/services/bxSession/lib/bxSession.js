angular.module('bxSession.session', []).provider('bxSession', function() {
  var $http, $q, $rootScope, api, authenticated, checkBootstrap, loadSession, onError, scope, session, update;
  session = null;
  authenticated = false;
  scope = null;
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
  $rootScope = null;
  $http = null;
  $q = null;
  checkBootstrap = function() {
    var err;
    if (!$rootScope || !$http || !$q) {
      err = new Error('bxSession dependencies not initialized.');
      console.log('ERROR! bxSession not initialized.', err);
      throw err;
      return false;
    }
  };
  loadSession = function(override) {
    var deferred, promise;
    checkBootstrap();
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
    return scope.$emit('bxSession:' + emit, session);
  };
  this.$get = function() {
    return {
      bootstrap: function(_rootScope, _http, _q) {
        scope = $rootScope = _rootScope;
        $http = _http;
        return $q = _q;
      },
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
      },
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
        checkBootstrap();
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
        checkBootstrap();
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
        checkBootstrap();
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
  };
  return this;
});

angular.module('bxSession.auth', ['bxSession.session']).provider('bxAuth', function() {
  var $q, $state, bxSession;
  bxSession = null;
  $state = null;
  $q = null;
  this.auth = function(options) {
    return function() {
      var deferred, err, redirAuth, reqAuth;
      if (!bxSession || !$state || !$q) {
        err = new Error('bxAuth dependencies not initialized.');
        console.log('ERROR! bxAuth not initialized.', err);
        throw err;
        return null;
      }
      if (!('reqAuth' in options)) {
        throw new Error('bxAuth requires options.reqAuth ' + 'in the options object');
      }
      if (!('redirAuth' in options)) {
        throw new Error('bxAuth requires options.redirAuth ' + 'in the options object');
      }
      reqAuth = options.reqAuth;
      redirAuth = options.redirAuth;
      deferred = $q.defer();
      bxSession.load().then(function(session) {
        if (reqAuth) {
          if ((session == null) || !Object.getOwnPropertyNames(session).length) {
            deferred.reject(null);
            return $state.go(reqAuth);
          } else {
            return deferred.resolve(true);
          }
        } else if (redirAuth) {
          if (session && Object.getOwnPropertyNames(session).length) {
            deferred.reject(null);
            return $state.go(redirAuth);
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
      bootstrap: function(_state, _q, _bxSession) {
        bxSession = _bxSession;
        $state = _state;
        return $q = _q;
      }
    };
  };
  return this;
});

angular.module('bxSession', ['bxSession.auth', 'ui.router']).run([
  '$rootScope', '$state', '$http', '$q', 'bxAuth', 'bxSession', function($rootScope, $state, $http, $q, bxAuth, bxSession) {
    bxAuth.bootstrap($state, $q, bxSession);
    return bxSession.bootstrap($rootScope, $http, $q);
  }
]);
