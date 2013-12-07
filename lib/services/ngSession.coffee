angular.module('ngSession.session', [ 'ng' ])
.provider 'ngSession', () ->
  session = null
  authenticated = false
  scope = null

  onError = () ->
    session = null
    authenticated = false

  api =
    login: '/api/login'
    logout: '/api/logout'
    signup: '/api/signup'
    session: '/api/session'

  $rootScope = null
  $http = null
  $q = null

  checkBootstrap = () ->
    if !$rootScope || !$http || !$q
      err = new Error 'ngSession dependencies not initialized.'
      console.log 'ERROR! ngSession not initialized.', err
      throw err
      return false

  loadSession = (override) ->
    checkBootstrap()

    deferred = $q.defer()
    promise = deferred.promise

    if !session or override
      $http.get(api.session)
      .success (data, status, headers, config) ->
        update 'loaded', ->
          session = data
          deferred.resolve data
      .error (data, status, headers, config) ->
        update 'error', ->
          onError && onError()
          deferred.reject {}
    else
      deferred.resolve session

    promise

  update = (emit, fn) ->
    if scope.$$phase or scope.$root.$$phase
      fn()
    else
      scope.$apply fn

    scope.$emit 'ngSession:' + emit, session

  @$get = () ->
    bootStrap: (_rootScope, _http, _q) ->
      scope = $rootScope = _rootScope
      $http = _http
      $q = _q

    config: (options) ->
      api.login = options.login if options.login
      api.logout = options.logout if options.logout
      api.signup = options.signup if options.signup
      api.session = options.session if options.session
      scope = options.scope if options.scope

      if options.onError
        if typeof options.onError isnt 'function'
          err = new Error 'ngSession.config() requires ' +
            'options.onError to be typeof == function'
        else
          onError = options.onError

    load: () ->
      loadSession false

    refresh: () ->
      loadSession true

    isAuthenticated: () ->
      authenticated

    login: (username, password) ->
      checkBootstrap()
      deferred = $q.defer()

      $http.post(api.login,
        username: username
        password: password
      ).success (data, status, headers, config) ->
        session = data
        update 'login', () ->
          authenticated = true
          deferred.resolve true
      .error (data, status, headers, config) ->
        session = null
        update 'error', () ->
          onError && onError()
          deferred.reject false

      deferred.promise

    logout: () ->
      checkBootstrap()
      deferred = $q.defer()

      $http.get(api.logout)
      .success (data, status, headers, config) ->
        session = null
        update 'logout', () ->
          authenticated = false
          deferred.resolve true
      .error (data, status, headers, config) ->
        session = null
        update 'error', () ->
          onError && onError()
          deferred.reject false

      deferred.promise

  return @



angular.module('ngSession.auth', [ 'ngSession.session' ])
.provider 'ngAuth', ->
  ngSession = null
  $state = null
  $q = null

  @auth = (options) ->
    return ->
      if !ngSession || !$state || !$q
        err = new Error 'ngAuth dependencies not initialized.'
        console.log 'ERROR! ngAuth not initialized.', err
        throw err
        return null

      if !('reqAuth' of options)
        throw new Error 'ngAuth requires options.reqAuth ' +
          'in the options object'
      if !('redirAuth' of options)
        throw new Error 'ngAuth requires options.redirAuth ' +
          'in the options object'

      reqAuth = options.reqAuth
      redirAuth = options.redirAuth

      deferred = $q.defer()

      ngSession.load().then (session) ->
        if reqAuth
          if !session? or !Object.getOwnPropertyNames(session).length
            deferred.reject null
            $state.go reqAuth
          else
            deferred.resolve true
        else if redirAuth
          if session and Object.getOwnPropertyNames(session).length
            deferred.reject null
            $state.go redirAuth
          else
            deferred.resolve true
        else
          deferred.resolve true

      deferred.promise

  @$get = () ->
    bootStrap: (_state, _q, _ngSession) ->
      ngSession = _ngSession
      $state = _state
      $q = _q

  return @



angular.module('ngSession', [ 'ngSession.auth', 'ui.router' ])
.run [
  '$rootScope', '$state', '$http', '$q', 'ngAuth', 'ngSession'
  ($rootScope, $state, $http, $q, ngAuth, ngSession) ->
    ngAuth.bootStrap $state, $q, ngSession
    ngSession.bootStrap $rootScope, $http, $q
]
