angular.module('bxSession.session', [])

.service 'bxSession', [
  '$rootScope', '$http', '$q'
  ($rootScope, $http, $q)->
    session = null
    authenticated = false
    scope = null

    # TODO: emit error object
    onError = () ->
      session = null
      authenticated = false

    api =
      login: '/api/login'
      logout: '/api/logout'
      signup: '/api/signup'
      session: '/api/session'

    loadSession = (override) ->
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

      scope.$emit 'session:' + emit, session
      scope.$emit 'session:loaded' + session

      config: (options) ->
        api.login = options.login if options.login
        api.logout = options.logout if options.logout
        api.signup = options.signup if options.signup
        api.session = options.session if options.session
        scope = options.scope if options.scope

        if options.onError
          if typeof options.onError isnt 'function'
            err = new Error 'bxSession.config() requires ' +
              'options.onError to be typeof == function'
          else
            onError = options.onError

    # return methods
    load: () ->
      loadSession false

    refresh: () ->
      loadSession true

    isAuthenticated: () ->
      authenticated

    login: (username, password) ->
      deferred = $q.defer()

      $http.post(api.login,
        username: username
        password: password
      ).success (data, status, headers, config) ->
        update 'login', () ->
          session = data
          authenticated = true
          deferred.resolve true
      .error (data, status, headers, config) ->
        update 'error', () ->
          onError && onError()
          deferred.reject false

      deferred.promise

    signup: (username, password) ->
      deferred = $q.defer()

      $http.post(api.signup,
        username: username
        password: password
      ).success (data, status, headers, config) ->
        update 'signup', () ->
          update = data
          authenticated = true
          deferred.resolve true
      .error (data, status, headers, config) ->
        update 'error', () ->
          onError && onError()
          deferred.reject false

      deferred.promise

    logout: () ->
      deferred = $q.defer()

      $http.get(api.logout)
      .success (data, status, headers, config) ->
        update 'logout', () ->
          session = null
          authenticated = false
          deferred.resolve true
      .error (data, status, headers, config) ->
        update 'error', () ->
          onError && onError()
          deferred.reject false

      deferred.promise
]



angular.module('bxSession.auth', [ 'bxSession.session' ])

.provider 'bxAuth', ->
  util = null
  bxSession = null
  $state = null
  $q = null

  @auth = (options) ->
    return ->
      if !util || !bxSession || !$state || !$q
        err = new Error 'bxAuth dependencies not initialized.'
        console.log 'ERROR! bxAuth not initialized.', err
        throw err
        return null

      if !('authKey' of options)
        throw new Error 'bxAuth requires options.authKey ' +
          'in the options object'
      else if !('reqAuth' of options)
        throw new Error 'bxAuth requires options.reqAuth ' +
          'in the options object'
      else if !('redirAuth' of options)
        throw new Error 'bxAuth requires options.redirAuth ' +
          'in the options object'

      authKey = options.authKey
      reqAuth = options.reqAuth
      redirAuth = options.redirAuth

      deferred = $q.defer()

      bxSession.load().then (session) ->
        if reqAuth
          # if route requires auth but user not authenticated
          if !session? || typeof session isnt 'object' or !(authKey of session)
            deferred.reject null

            # if not on reqAuth page, redirect
            if $state.current.name isnt reqAuth
              console.log 'Page req auth. User not auth. Redirect to '
              $state.go reqAuth
            else
              # else, return generate random token + redirect to self
              console.log 'Page req auth. User already on page.' +
                ' Generating  random token.'
              $state.go redirAuth
                redirect: util.random 15
          else
            deferred.resolve true
        else if redirAuth # if meant to redirect authenticated users
          # if already authenticated
          if session and Object.getOwnPropertyNames(session).length
            deferred.reject null

            # if not on redirAuth page, redirect
            console.log 'Redirecting auth user.'
            if $state.current.name isnt redirAuth
              $state.go redirAuth
            else
              # else, return generate random token + redirect to self
              console.log 'Redirecting auth users. Already on redir.' +
                ' Generating random token.'
              $state.go redirAuth
                redirect: util.random 15
          else
            deferred.resolve true
        else
          deferred.resolve true

      deferred.promise

  @$get = () ->
    bootstrap: (_state, _q, _bxSession, _util) ->
      bxSession = _bxSession
      $state = _state
      $q = _q
      util = _util

  return @



angular.module('bxSession', [ 'ui.router', 'bxSession.auth', 'bxUtil' ])

.run [
  '$rootScope', '$state', '$http', '$q', 'bxAuth', 'bxSession', 'bxUtil'
  ($rootScope, $state, $http, $q, bxAuth, bxSession, bxUtil) ->
    # inject dependencies into bxAuth provider
    bxAuth.bootstrap $state, $q, bxSession, bxUtil
]
