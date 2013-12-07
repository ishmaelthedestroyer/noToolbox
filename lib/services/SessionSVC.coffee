app.service 'Session', [
  '$rootScope', '$http', '$q'
  ($rootScope, $http ,$q) ->
    session = null
    authenticated = false

    loadSession = (override) ->
      deferred = $q.defer()
      promise = deferred.promise

      if !session or override
        $http.get('/api/session')
        .success (data, status, headers, config) ->
          session = data
          deferred.resolve data
        .error (data, status, headers, config) ->
          session = null
          deferred.resolve {}
      else
        deferred.resolve session

      promise

    apply = (scope, fn) ->
      $rootScope.$emit 'app:session', session
      if scope.$$phase or scope.$root.$$phase
        fn()
      else
        scope.$apply fn

    ###
    loadSession().then (data) ->
      apply $rootScope, () ->
        session = data
    ###
    load: () ->
      loadSession false
    refresh: () ->
      loadSession true
    isAuthenticated: () ->
      authenticated
    login: (username, password) ->
      deferred = $q.defer()

      $http.post('/api/login',
        username: username
        password: password
      ).success (data, status, headers, config) ->
        session = data
        apply $rootScope, () ->
          authenticated = true
          deferred.resolve true
      .error (data, status, headers, config) ->
          session = null
          apply $rootScope, () ->
            authenticated = false
            deferred.reject false

      deferred.promise
    logout: () ->
      deferred = $q.defer()

      $http.get('/api/logout')
      .success (data, status, headers, config) ->
        session = null
        apply $rootScope, () ->
          authenticated = false
          deferred.resolve true
      .error (data, status, headers, config) ->
        session = null
        apply $rootScope, () ->
          authenticated = false
          deferred.reject false

      deferred.promise
]
