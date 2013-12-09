angular.module('bxSocket', [])

.service 'bxSocket', [
  '$rootScope', '$http', '$q', '$timeout', 'bxLogger'
  ($rootScope, $http, $q, $timeout, Logger) ->
    scope = null
    socket = null
    initialized = false
    open = false

    host = location.protocol + '//' + location.hostname
    if location.port then host += ':' + location.port

    load = (url) ->
      # create async promise
      deferred = $q.defer()
      promise = deferred.promise

      if window.io # if loaded, return resolved promise
        deferred.resolve true
        return promise

      # create script tag, config
      sio = document.createElement 'script'
      sio.type = 'text/javascript'
      sio.async = true

      # set script to url or relative socket.io link
      sio.src = url || '/socket.io/socket.io.js'

      # append to body
      _s = document.getElementsByTagName('script')[0]
      _s.parentNode.insertBefore sio, _s

      # recursive function to check if socket.io loaded
      wait = () ->
        setTimeout ->
          if window.io # if socket.io loaded
            return deferred.resolve true

          # else, call self
          wait()
        , 100 # fire every 0.1seconds

      return promise

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

    open: (url, wait) ->
      deferred = $q.defer()

      # return resolved promise if open
      if open
        promise = deferred.promise
        deferred.resolve true
        return promise

      load(url).then () -> # call function to load script
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
