app.service 'Socket', [
  '$rootScope', '$http', '$q', '$timeout', 'Logger'
  ($rootScope, $http, $q, $timeout, Logger) ->
    scope = null
    socket = null
    initialized = false
    open = false

    host = location.protocol + '//' + location.hostname
    if location.port then host += ':' + location.port

    apply = (scope, fn) ->
      if scope.$$phase or scope.$root.$$phase
        fn()
      else
        scope.$apply fn

    # return methods
    isOpen: () ->
      return open

    setScope: (s) ->
      scope = s

    emit: (e, data, cb) ->
      if !socket or !open
        throw new Error 'Socket closed!'
        return false

      socket.emit e, data, ->
        apply scope || $rootScope, ->
          cb && cb()

    on: (e, cb) ->
      socket.removeListener e, cb

      socket.on e, (data) ->
        apply scope || $rootScope, ->
          cb && cb(data)

    removeListener: (e, cb) ->
      socket.removeListener e, cb

    removeAllListeners: ->
      socket.removeAllListeners()

    close: () ->
      if socket
        socket.disconnect()
        open = false

    open: (wait) ->
      return Logger.warn 'Tried to open socket. Already open.' if open
      waiting = false; timedOut = false; delay = 0

      count = (max, deferred) -> # recursive timeout func
        Logger.debug 'Counting to ' + max + '... currently at ' +
          delay + '...'
        $timeout ->
          return false if !waiting
          if ++delay >= max
            timedOut = true
            Logger.error 'Socket.open() request timed out.'
            deferred.reject null
            return false
          else
            count max, deferred
        , 1000

      deferred = $q.defer()
      if !initialized
        socket = io.connect host
        initialized = true
      else
        deferred.resolve true
        socket.socket.connect()

      waiting = true; count wait || 10, deferred
      socket.on 'server:handshake', (data) ->
        return false if timedOut
        delay = 0; open = true; waiting = false
        Logger.info 'Handshake successful.'
        deferred.resolve data

      return deferred.promise
]
