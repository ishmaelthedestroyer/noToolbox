angular.module('bxAnimateToCenter', []).directive('bxAnimateToCenter', function($window) {
  return function(scope, element, attr) {
    var h, offsetx, offsety, speed, w, x, y;
    speed = parseInt(attr.animatespeed || 1000);
    offsetx = parseInt(attr.animateoffsetx || 0);
    offsety = parseInt(attr.animateoffsety || 0);
    x = ($window.innerHeight / 2) - (element.height() / 2) + offsetx;
    y = ($window.innerWidth / 2) - (element.width() / 2) + offsety;
    console.log('params: ' + offsetx + ',' + offsety + ',' + speed);
    w = attr.animatetowidth || element.width();
    h = attr.animatetoheight || element.height();
    element.css({
      left: 0 + 'px',
      top: 0 + 'px',
      width: 0 + 'px',
      height: 0 + 'px'
    });
    return element.animate({
      top: x + 'px',
      left: y + 'px',
      width: w + 'px',
      height: h + 'px'
    }, speed, function() {
      return element.removeAttr('bxAnimateToCenter');
    });
  };
});

angular.module('bxDraggable', []).directive('bxDraggable', function($document) {
  return function(scope, element, attr) {
    var mousemove, mouseup, startX, startY, x, y;
    startX = 0;
    startY = 0;
    x = 0;
    y = 0;
    element.css({
      cursor: 'pointer'
    });
    mousemove = function(event) {
      y = event.screenY - startY;
      x = event.screenX - startX;
      return element.css({
        left: x + 'px',
        top: y + 'px'
      });
    };
    mouseup = function() {
      $document.unbind('mousemove', mousemove);
      return $document.unbind('mouseup', mouseup);
    };
    return element.on('mousedown', function(event) {
      event.preventDefault();
      startX = event.screenX - element.offset().left;
      startY = event.screenY - element.offset().top;
      $document.on('mousemove', mousemove);
      return $document.on('mouseup', mouseup);
    });
  };
});

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

angular.module('bxFisheye', []).directive('bxFisheye', function($document) {
  return function(scope, element, attr) {
    var maxHeight, maxWidth, radius, scale, startHeight, startWidth;
    scale = attr.fisheyescale || 0.8;
    radius = attr.fisheyeradius || 70;
    scale = parseFloat(scale);
    radius = parseInt(radius);
    startWidth = element.width();
    startHeight = element.height();
    maxWidth = startWidth + (startWidth * scale);
    maxHeight = startHeight + (startHeight * scale);
    return $document.on('mousemove', function(e) {
      var centerX, centerY, h, percent, r, w, x, y;
      centerX = element.offset().left + (element.width() / 2);
      centerY = element.offset().top + (element.height() / 2);
      x = Math.abs(e.pageX - centerX);
      y = Math.abs(e.pageY - centerY);
      r = Math.sqrt((x * x) + (y * y));
      if (r < radius) {
        percent = 1 - (r / radius);
        w = startWidth + ((maxWidth - startWidth) * percent);
        h = startHeight + ((maxHeight - startHeight) * percent);
        return element.css({
          width: w + 'px',
          height: h + 'px'
        });
      } else {
        if (element.width() !== startWidth || element.height() !== startHeight) {
          return element.css({
            width: startWidth + 'px',
            height: startHeight + 'px'
          });
        }
      }
    });
  };
});

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

angular.module('bxOnKeyUp', []).directive('bxOnKeyUp', function($document) {
  return function(scope, element, attr) {
    return element.bind('keyup', function() {
      return scope.$apply(attr.bxOnKeyUp);
    });
  };
});

angular.module('bxPreventRightClick', []).directive('bxPreventRightClick', function($document) {
  return function(scope, element, attr) {
    if (attr.bxPreventRightClick === 'true') {
      return element.bind('contextmenu', function(e) {
        return scope.$apply(function() {
          e.preventDefault();
          return e.stopPropagation();
        });
      });
    }
  };
});

angular.module('bxResizable', []).directive('bxResizable', function($document) {
  return function(scope, element, attr) {
    var image, mousemove, mouseup, offset, resize;
    offset = 8;
    offset = attr.bxResizableOffset || 8;
    image = attr.bxResizableImage || '/assets/vendor/ngToolboxx/dist/img/resize-white.png';
    resize = document.createElement('img');
    resize.setAttribute('src', image);
    resize.style.width = '20px';
    resize.style.height = '20px';
    resize.style.right = offset + 'px';
    resize.style.bottom = offset + 'px';
    resize.style.zIndex = 9999;
    resize.style.position = 'absolute';
    element.append(resize);
    element.css({
      cursor: 'pointer'
    });
    mousemove = function(event) {
      var h, w;
      w = event.pageX - element.offset().left + offset;
      h = event.pageY - element.offset().top + offset;
      if (w < 50) {
        w = 50;
      }
      if (h < 50) {
        h = 50;
      }
      return element.css({
        width: w + 'px',
        height: h + 'px'
      });
    };
    mouseup = function() {
      $document.unbind('mousemove', mousemove);
      return $document.unbind('mouseup', mouseup);
    };
    return resize.onmousedown = function(event) {
      event.preventDefault();
      event.stopPropagation();
      $document.on('mousemove', mousemove);
      return $document.on('mouseup', mouseup);
    };
  };
});

angular.module('bxRightClickMenu', []).directive('bxRightClickMenu', function($document) {
  return function(scope, element, attr) {
    var menu;
    menu = $(attr.bxRightClickMenu);
    menu.css({
      position: 'fixed'
    });
    return element.bind('contextmenu', function(e) {
      return scope.$apply(function() {
        var x, y;
        e.preventDefault();
        e.stopPropagation();
        x = e.clientX;
        y = e.clientY;
        menu.css({
          left: x + 'px',
          top: y + 'px'
        });
        return menu.find('.dropdown-toggle').dropdown('toggle');
      });
    });
  };
});

angular.module('bxSluggify', []).directive('bxSluggify', function($document) {
  return function(scope, element, attr) {
    var sluggify;
    sluggify = function(text) {
      return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    };
    return element.bind('keyup', function() {
      var slug;
      slug = sluggify(element.val());
      return scope.$apply(element.val(slug));
    });
  };
});

angular.module('bxSubmitOnEnter', []).directive('bxSubmitOnEnter', function() {
  return function(scope, element, attr) {
    return element.bind('keydown keypress', function(e) {
      if (e.which === 13) {
        scope.$apply(function() {
          return scope.$eval(attr.bxSubmitOnEnter);
        });
        return e.preventDefault();
      }
    });
  };
});

angular.module('bxFormatFileSize', []).provider('bxFormatFileSizeFilter', function() {
  var $config;
  $config = {
    units: [
      {
        size: 1000000000,
        suffix: " GB"
      }, {
        size: 1000000,
        suffix: " MB"
      }, {
        size: 1000,
        suffix: " KB"
      }
    ]
  };
  this.defaults = $config;
  this.$get = function() {
    return function(bytes) {
      var i, prefix, suffix, unit;
      if (!angular.isNumber(bytes)) {
        return "";
      }
      unit = true;
      i = 0;
      prefix = void 0;
      suffix = void 0;
      while (unit) {
        unit = $config.units[i];
        prefix = unit.prefix || "";
        suffix = unit.suffix || "";
        if (i === $config.units.length - 1 || bytes >= unit.size) {
          return prefix + (bytes / unit.size).toFixed(2) + suffix;
        }
        i += 1;
      }
    };
  };
});

angular.module('bxErrorInterceptor', ['bxNotify']).factory('bxErrorInterceptor', [
  '$rootScope', '$location', '$q', 'bxNotify', function($rootScope, $location, $q, Notify) {
    return function(promise) {
      return promise.then(function(response) {
        return response;
      }, function(response) {
        Notify.push(response.data, 'danger', 5000);
        if (response.status === 401) {
          $rootScope.$emit('401');
        }
        return $q.reject(response);
      });
    };
  }
]).config(function($httpProvider) {
  return $httpProvider.responseInterceptors.push('bxErrorInterceptor');
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('bxLogger', []).service('bxLogger', [
  '$http', function($http) {
    var config, notify, setMode, setSentry;
    config = {
      mode: 'development',
      sentry: '/api/sentry',
      output: null,
      notify: null
    };
    /* Logic below defaults to:
    mode: 'development'
    sentry: '/api/sentry'
    output: [ 'debug', 'info', 'warn', 'error']
    notify: [ 'warn', 'error', 'global' ]
    */

    notify = function(type, message, info) {
      return $http.post(config.sentry, {
        mode: config.mode,
        type: type,
        message: message,
        info: info || {}
      });
    };
    window.onerror = function(msg, url, line) {
      if ((config.notify instanceof Array && __indexOf.call(config.notify, 'global') >= 0) || (!config.output && config.mode === 'production')) {
        return notify('global', 'An unhandled error occured.', {
          msg: msg,
          url: url,
          line: line
        });
      }
    };
    setMode = function(m) {
      return config.mode = m;
    };
    setSentry = function(s) {
      return config.sentry = s;
    };
    return {
      debug: function(msg, info) {
        var color;
        color = 'color: #333; background-color: #fff;';
        if ((config.output instanceof Array && __indexOf.call(config.output, 'debug') >= 0) || (!config.output && config.mode === 'development')) {
          console.log('%c DEBUG >> ' + msg, color, info || '');
        }
        if (config.notify instanceof Array && __indexOf.call(config.notify, 'debug') >= 0) {
          return notify('debug', msg, info);
        }
      },
      info: function(msg, info) {
        var color;
        color = 'color: #5E9CD2; background-color: #fff;';
        if ((config.output instanceof Array && __indexOf.call(config.output, 'info') >= 0) || (!config.output && config.mode === 'development')) {
          console.log('%c INFO >> ' + msg, color, info || '');
        }
        if (config.notify instanceof Array && __indexOf.call(config.notify, 'info') >= 0) {
          return notify('debug', msg, info);
        }
      },
      warn: function(msg, info) {
        var color;
        color = 'color: #FF9900; background-color: #fff;';
        if ((config.output instanceof Array && __indexOf.call(config.output, 'warn') >= 0) || (!config.output && config.mode === 'development')) {
          console.log('%c WARNING >> ' + msg, color, info || '');
        }
        if ((config.notify instanceof Array && __indexOf.call(config.notify, 'warn') >= 0) || (!config.notify && config.mode === 'production')) {
          return notify('warn', msg, info);
        }
      },
      error: function(msg, info) {
        var color;
        color = 'color: #f00; background-color: #fff;';
        if ((config.output instanceof Array && __indexOf.call(config.output, 'error') >= 0) || (!config.output && config.mode === 'development')) {
          console.log('%c ERROR >> ' + msg, color, info || '');
        }
        if ((config.notify instanceof Array && __indexOf.call(config.notify, 'error') >= 0) || (!config.notify && config.mode === 'production')) {
          return notify('error', msg, info);
        }
      }
    };
  }
]);

angular.module('bxNotify', []).service('bxNotify', [
  '$rootScope', '$timeout', function($rootScope, $timeout) {
    var apply, notifications, remove, scope;
    notifications = [];
    scope = $rootScope;
    apply = function(scope, fn) {
      if (scope.$$phase || scope.$root.$$phase) {
        return fn();
      } else {
        return scope.$apply(fn);
      }
    };
    remove = function(notif) {
      return apply(scope, function() {
        var i, n, _i, _len;
        if (typeof notif === 'object') {
          for (i = _i = 0, _len = notifications.length; _i < _len; i = ++_i) {
            n = notifications[i];
            if (n === notif) {
              return notifications.splice(i, 1);
            }
          }
        } else {
          return notifications.splice(notif, 1);
        }
      });
    };
    return {
      setScope: function(s) {
        return scope = s;
      },
      list: function() {
        return notifications;
      },
      remove: function(notif) {
        return remove(notif);
      },
      push: function(message, type, timeout) {
        var notif;
        if (type == null) {
          type = 'success';
        }
        notif = {
          message: message,
          type: type
        };
        apply(scope, function() {
          notifications.unshift(notif);
          if (notifications.length > 10) {
            return notifications.pop();
          }
        });
        if (timeout) {
          $timeout(function() {
            return remove(notif);
          }, timeout);
        }
        return notif;
      }
    };
  }
]);

angular.module('bxQueue', []).factory('bxQueue', [
  '$rootScope', '$timeout', function($rootScope, $timeout) {
    var apply, queue, remove, scope;
    queue = [];
    scope = $rootScope;
    apply = function(scope, fn) {
      if (scope.$$phase || scope.$root.$$phase) {
        return fn();
      } else {
        return scope.$apply(fn);
      }
    };
    remove = function(promise, callback) {
      return apply(scope, function() {
        var i, _results;
        i = 0;
        _results = [];
        while (i < queue.length) {
          if (queue[i] === promise) {
            queue.splice(i, 1);
            if (typeof callback === "function") {
              callback(callback());
            }
            break;
          }
          _results.push(++i);
        }
        return _results;
      });
    };
    return {
      setScope: function(s) {
        return scope = s;
      },
      list: function() {
        return queue;
      },
      push: function(promise, timeout, callback) {
        apply(scope, function() {
          return queue.push(promise);
        });
        promise.then(function() {
          return remove(promise, callback);
        }, function(err) {
          return remove(promise, callback);
        });
        if (timeout) {
          return $timeout(function() {
            return remove(promise, callback);
          }, timeout);
        }
      },
      remove: function(promise) {
        return remove(promise);
      },
      clear: function() {
        return apply(scope, function() {
          return queue = [];
        });
      }
    };
  }
]);

angular.module('bxResource', ['ngResource']).service('bxResource', [
  '$resource', function($resource) {
    var resources;
    resources = {};
    return {
      get: function(name, url, params) {
        /*
        This method checks for an existing resource object of the same name.
        If one doesn't exist, it creates a new one and bootstraps it to
        the bxResource module so it can be fetched again in the future by the
        same or other controllers. The only required parameter is first, `name`.
        If the `url` and `params` parameters are left out, a generic resource will
        be created with this model:
        
        angular.module('bxResource').factory(`name`, [
          '$resource', function($resource) {
            $resource('/api/`name`/:id', {
              id: '@id'
            })
          }
        ]);
        */

        var key, resource;
        for (key in resources) {
          if (key === name) {
            return resources[key];
          }
        }
        if (!params) {
          params = {
            id: '@id'
          };
        }
        url = url || '/api/' + name.toLowerCase() + '/:id';
        /*
        resource = angular.module('bxResource').factory name, [
          '$resource', ($resource) ->
            $resource url, params
        ]
        */

        resources[name] = resource = $resource(url, params);
        return resource;
      }
    };
  }
]);

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
      if (emit !== 'loaded') {
        return scope.$emit('session:loaded', session);
      }
    };
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
  var $location, $q, $state, bxSession;
  bxSession = null;
  $location = null;
  $state = null;
  $q = null;
  this.auth = function(options) {
    return function() {
      var authKey, deferred, handleError, redirAuth, reqAuth;
      handleError = function(err) {
        err = new Error(err);
        console.log(err);
        throw err;
        return false;
      };
      if (!bxSession || !$location || !$state || !$q) {
        return handleError('ERROR! bxAuth not initialized.');
      }
      if (!('authKey' in options)) {
        return handleError('bxAuth requires options.authKey ' + 'in the options object');
      } else if (!('reqAuth' in options)) {
        return handleError('bxAuth requires options.reqAuth ' + 'in the options object');
      } else if (!('redirAuth' in options)) {
        return handleError('bxAuth requires options.redirAuth ' + 'in the options object');
      }
      authKey = options.authKey;
      reqAuth = options.reqAuth;
      redirAuth = options.redirAuth;
      deferred = $q.defer();
      bxSession.load().then(function(session) {
        if (reqAuth) {
          if ((session == null) || typeof session !== 'object' || !(authKey in session)) {
            deferred.resolve(null);
            if ($state.current.name !== reqAuth) {
              return $state.go(reqAuth);
            } else {
              return $location.path($state.current.url);
            }
          } else {
            return deferred.resolve(true);
          }
        } else if (redirAuth) {
          if (session && Object.getOwnPropertyNames(session).length) {
            deferred.reject(null);
            if ($state.current.name !== redirAuth) {
              return $state.go(redirAuth);
            } else {
              return $location.path($state.current.url);
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
      bootstrap: function(_location, _state, _q, _bxSession) {
        $location = _location;
        $state = _state;
        $q = _q;
        return bxSession = _bxSession;
      }
    };
  };
  return this;
});

angular.module('bxSession', ['ui.router', 'bxSession.auth']).run([
  '$rootScope', '$state', '$location', '$http', '$q', 'bxAuth', 'bxSession', function($rootScope, $state, $location, $http, $q, bxAuth, bxSession) {
    return bxAuth.bootstrap($location, $state, $q, bxSession);
  }
]);

angular.module('bxStream', ['bxUtil', 'bxEventEmitter']).service('bxStream', [
  'bxUtil', 'bxEventEmitter', function(util, EventEmitter) {
    var EE, Stream, ref;
    EE = EventEmitter.get();
    Stream = function() {
      return EE.call(this);
    };
    util.inherits(Stream, EE);
    Stream.prototype.pipe = function(dest, options) {
      var cleanup, didOnEnd, onclose, ondata, ondrain, onend, onerror, source;
      ondata = function(chunk) {
        if (dest.writable) {
          if (false === dest.write(chunk) && source.pause) {
            return source.pause();
          }
        }
      };
      ondrain = function() {
        if (source.readable && source.resume) {
          return source.resume();
        }
      };
      onend = function() {
        var didOnEnd;
        if (didOnEnd) {
          return;
        }
        didOnEnd = true;
        return dest.end();
      };
      onclose = function() {
        var didOnEnd;
        if (didOnEnd) {
          return;
        }
        didOnEnd = true;
        if (typeof dest.destroy === "function") {
          return dest.destroy();
        }
      };
      onerror = function(er) {
        cleanup();
        if (EE.listenerCount(this, "error") === 0) {
          throw er;
        }
      };
      cleanup = function() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        return dest.removeListener("close", cleanup);
      };
      source = this;
      source.on("data", ondata);
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend);
        source.on("close", onclose);
      }
      didOnEnd = false;
      source.on("error", onerror);
      dest.on("error", onerror);
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
    ref = new Stream;
    return {
      create: function() {
        return new Stream;
      },
      get: function() {
        return Stream;
      },
      pipe: ref.pipe
    };
  }
]);

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

angular.module('bxUtil', []).service('bxUtil', function() {
  var arrayToHash, async, format, formatArray, formatError, formatPrimitive, formatProperty, formatRegExp, formatValue, inherits, inspect, isArray, isBoolean, isBuffer, isDate, isError, isFunction, isNull, isNullOrUndefined, isNumber, isObject, isPrimitive, isRegExp, isString, isSymbol, isUndefined, log, months, objectToString, pad, random, reduceToSingleString, stylizeNoColor, stylizeWithColor, timestamp, _extend;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  formatRegExp = /%[sdj%]/g;
  isArray = function(ar) {
    return Array.isArray(ar);
  };
  isBoolean = function(arg) {
    return typeof arg === "boolean";
  };
  isNull = function(arg) {
    return arg === null;
  };
  isNullOrUndefined = function(arg) {
    return arg == null;
  };
  isNumber = function(arg) {
    return typeof arg === "number";
  };
  isString = function(arg) {
    return typeof arg === "string";
  };
  isSymbol = function(arg) {
    return typeof arg === "symbol";
  };
  isUndefined = function(arg) {
    return arg === void 0;
  };
  isRegExp = function(re) {
    return isObject(re) && objectToString(re) === "[object RegExp]";
  };
  isObject = function(arg) {
    return typeof arg === "object" && arg;
  };
  isDate = function(d) {
    return isObject(d) && objectToString(d) === "[object Date]";
  };
  isError = function(e) {
    return isObject(e) && objectToString(e) === "[object Error]";
  };
  isFunction = function(arg) {
    return typeof arg === "function";
  };
  isPrimitive = function(arg) {
    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
  };
  isBuffer = function(arg) {
    return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.binarySlice === "function";
  };
  format = function(f) {
    var args, i, len, objects, str, x;
    if (!isString(f)) {
      objects = [];
      i = 0;
      while (i < arguments.length) {
        objects.push(inspect(arguments[i]));
        i++;
      }
      return objects.join(" ");
    }
    i = 1;
    args = arguments;
    len = args.length;
    str = String(f).replace(formatRegExp, function(x) {
      var _;
      if (x === "%%") {
        return "%";
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case "%s":
          return String(args[i++]);
        case "%d":
          return Number(args[i++]);
        case "%j":
          try {
            return JSON.stringify(args[i++]);
          } catch (_error) {
            _ = _error;
            return "[Circular]";
          }
          break;
        default:
          return x;
      }
    });
    x = args[i];
    while (i < len) {
      if (isNull(x) || !isObject(x)) {
        str += " " + x;
      } else {
        str += " " + inspect(x);
      }
      x = args[++i];
    }
    return str;
  };
  formatValue = function(ctx, value, recurseTimes) {
    var array, base, braces, keys, n, name, output, primitive, ret, visibleKeys;
    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect && !(value.constructor && value.constructor.prototype.is(value))) {
      ret = value.inspect(recurseTimes);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }
    primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
    keys = shims.keys(value);
    visibleKeys = arrayToHash(keys);
    if (ctx.showHidden) {
      keys = shims.getOwnPropertyNames(value);
    }
    if (keys.length === 0) {
      if (isFunction(value)) {
        name = (value.name ? ": " + value.name : "");
        return ctx.stylize("[Function" + name + "]", "special");
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), "date");
      }
      if (isError(value)) {
        return formatError(value);
      }
    }
    base = "";
    array = false;
    braces = ["{", "}"];
    if (isArray(value)) {
      array = true;
      braces = ["[", "]"];
    }
    if (isFunction(value)) {
      n = (value.name ? ": " + value.name : "");
      base = " [Function" + n + "]";
    }
    if (isRegExp(value)) {
      base = " " + RegExp.prototype.toString.call(value);
    }
    if (isDate(value)) {
      base = " " + Date.prototype.toUTCString.call(value);
    }
    if (isError(value)) {
      base = " " + formatError(value);
    }
    if (keys.length === 0 && (!array || value.length === 0)) {
      return braces[0] + base + braces[1];
    }
    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
      } else {
        return ctx.stylize("[Object]", "special");
      }
    }
    ctx.seen.push(value);
    output = void 0;
    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }
    ctx.seen.pop();
    return reduceToSingleString(output, base, braces);
  };
  formatPrimitive = function(ctx, value) {
    var simple;
    if (isUndefined(value)) {
      return ctx.stylize("undefined", "undefined");
    }
    if (isString(value)) {
      simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, "\"") + "'";
      return ctx.stylize(simple, "string");
    }
    if (isNumber(value)) {
      return ctx.stylize("" + value, "number");
    }
    if (isBoolean(value)) {
      return ctx.stylize("" + value, "boolean");
    }
    if (isNull(value)) {
      return ctx.stylize("null", "null");
    }
  };
  formatError = function(value) {
    return "[" + Error.prototype.toString.call(value) + "]";
  };
  formatArray = function(ctx, value, recurseTimes, visibleKeys, keys) {
    var f, i, l, output;
    output = [];
    i = 0;
    l = value.length;
    while (i < l) {
      if (hasOwnProperty(value, String(i))) {
        f = formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true);
        output.push(f);
      } else {
        output.push("");
      }
      ++i;
    }
    keys.forEach(function(key) {
      if (!key.match(/^\d+$/)) {
        f = formatProperty(ctx, value, recurseTimes, visibleKeys, key, true);
        return output.push(f);
      }
    });
    return output;
  };
  formatProperty = function(ctx, value, recurseTimes, visibleKeys, key, array) {
    var desc, name, str;
    name = void 0;
    str = void 0;
    desc = void 0;
    desc = Object.getOwnPropertyDescriptor(value, key) || {
      value: value[key]
    };
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize("[Getter/Setter]", "special");
      } else {
        str = ctx.stylize("[Getter]", "special");
      }
    } else {
      if (desc.set) {
        str = ctx.stylize("[Setter]", "special");
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      name = "[" + key + "]";
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf("\n") > -1) {
          if (array) {
            str = str.split("\n").map(function(line) {
              return "  " + line;
            }).join("\n").substr(2);
          } else {
            str = "\n" + str.split("\n").map(function(line) {
              return "   " + line;
            }).join("\n");
          }
        }
      } else {
        str = ctx.stylize("[Circular]", "special");
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify("" + key);
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, "name");
      } else {
        name = name.replace(/'/g, "\\'").replace(/\\"/g, "\"").replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, "string");
      }
    }
    return name + ": " + str;
  };
  reduceToSingleString = function(output, base, braces) {
    var length, numLinesEst;
    numLinesEst = 0;
    length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf("\n") >= 0) {
        numLinesEst++;
      }
      return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
    }, 0);
    if (length > 60) {
      return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
    }
    return braces[0] + base + " " + output.join(", ") + " " + braces[1];
  };
  pad = function(n) {
    if (n < 10) {
      return '0' + n.toString(10);
    } else {
      return n.toString(10);
    }
  };
  objectToString = function(o) {
    return Object.prototype.toString.call(o);
  };
  stylizeWithColor = function(str, styleType) {
    var style;
    style = inspect.styles[styleType];
    if (style) {
      return "\u001b[" + inspect.colors[style][0] + "m" + str + "\u001b[" + inspect.colors[style][1] + "m";
    } else {
      return str;
    }
  };
  stylizeNoColor = function(str, styleType) {
    return str;
  };
  inspect = function(obj, opts) {
    var ctx;
    ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    if (arguments.length >= 3) {
      ctx.depth = arguments[2];
    }
    if (arguments.length >= 4) {
      ctx.colors = arguments[3];
    }
    if (isBoolean(opts)) {
      ctx.showHidden = opts;
    } else {
      if (opts) {
        _extend(ctx, opts);
      }
    }
    if (isUndefined(ctx.showHidden)) {
      ctx.showHidden = false;
    }
    if (isUndefined(ctx.depth)) {
      ctx.depth = 2;
    }
    if (isUndefined(ctx.colors)) {
      ctx.colors = false;
    }
    if (isUndefined(ctx.customInspect)) {
      ctx.customInspect = true;
    }
    if (ctx.colors) {
      ctx.stylize = stylizeWithColor;
    }
    return formatValue(ctx, obj, ctx.depth);
  };
  inspect.colors = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39]
  };
  inspect.styles = {
    special: "cyan",
    number: "yellow",
    boolean: "yellow",
    undefined: "grey",
    "null": "bold",
    string: "green",
    date: "magenta",
    regexp: "red"
  };
  arrayToHash = function(array) {
    var hash;
    hash = {};
    array.forEach(function(val, idx) {
      return hash[val] = true;
    });
    return hash;
  };
  inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    return ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writeable: true,
        configurable: true
      }
    });
  };
  _extend = function(one, two) {
    var k, keys, _i, _len;
    if (!one) {
      return {};
    }
    if (!two || typeof two !== 'object') {
      return one;
    }
    keys = Object.keys(two);
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      k = keys[_i];
      one[k] = two[k];
    }
    return one;
  };
  log = function() {
    return console.log('%s - $s', timestamp(), format.apply(null, arguments));
  };
  random = function(length) {
    var list, token;
    token = '';
    list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm' + 'nopqrstuvwxyz0123456789';
    while (token.length < length) {
      token += list.charAt(Math.floor(Math.random() * list.length));
    }
    return token;
  };
  timestamp = function() {
    var d, time;
    d = new Date();
    time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":");
    return [d.getDate(), months[d.getMonth()], time].join(" ");
  };
  async = function(fn) {
    return setTimeout(function() {
      return fn;
    }, 0);
  };
  return {
    isArray: isArray,
    isBoolean: isBoolean,
    isNull: isNull,
    isNullOrUndefined: isNullOrUndefined,
    isNumber: isNumber,
    isString: isString,
    isSymbol: isSymbol,
    isUndefined: isUndefined,
    isRegExp: isRegExp,
    isObject: isObject,
    isDate: isDate,
    isError: isError,
    isFunction: isFunction,
    isPrimitive: isPrimitive,
    isBuffer: isBuffer,
    format: format,
    formatValue: formatValue,
    formatPrimitive: formatPrimitive,
    formatError: formatError,
    formatArray: formatArray,
    formatProperty: formatProperty,
    reduceToSingleString: reduceToSingleString,
    pad: pad,
    objectToString: objectToString,
    stylizeWithColor: stylizeWithColor,
    styleizeNoColor: styleizeNoColor,
    inspect: inspect,
    arrayToHash: arrayToHash,
    inherits: inherits,
    _extend: _extend,
    log: log,
    random: random,
    timestamp: timestamp,
    async: async
  };
});

angular.module('bxCtrl', ['bxNotify', 'bxQueue', 'bxSession']).controller('bxCtrl', [
  '$scope', '$rootScope', '$location', '$q', 'bxNotify', 'bxQueue', 'bxSession', 'bxLogger', function($scope, $rootScope, $location, $q, Notify, Queue, Session, Logger) {
    var apply;
    Notify.setScope($scope);
    Queue.setScope($scope);
    $scope.session = {};
    $scope.notifications = Notify.list();
    $scope.queue = Queue.list();
    $scope.loadSession = function() {
      var deferred;
      deferred = $q.defer();
      deferred = $q.defer();
      Queue.push(deferred.promise);
      return Session.refresh().then(function(data) {
        return deferred.resolve(true);
      });
    };
    $rootScope.$on('session:loaded', function(event, data) {
      Logger.debug('Updated session.', data);
      return $scope.session = data;
    });
    $scope.logout = function($e, location) {
      var deferred;
      $e.preventDefault();
      deferred = $q.defer();
      Queue.push(deferred.promise);
      return Session.logout().then(function(data) {
        $location.path('/' || location);
        return deferred.resolve(true);
      });
    };
    $scope.removeNotification = function(index) {
      return Notify.remove(index);
    };
    return apply = function(scope, fn) {
      if (scope.$$phase || scope.$root.$$phase) {
        return fn();
      } else {
        return scope.$apply(fn);
      }
    };
  }
]);

angular.module('ngToolboxx', ['bxCtrl', 'bxDraggable', 'bxFireOnClick', 'bxFisheye', 'bxOnDoubleClick', 'bxOnKeyUp', 'bxPreventRightClick', 'bxResizable', 'bxRightClickMenu', 'bxSluggify', 'bxSubmitOnEnter', 'bxFormatFileSize', 'bxErrorInterceptor', 'bxEventStream', 'bxLogger', 'bxNotify', 'bxQueue', 'bxResource', 'bxSession', 'bxSocket', 'bxStream', 'bxUtil']);
