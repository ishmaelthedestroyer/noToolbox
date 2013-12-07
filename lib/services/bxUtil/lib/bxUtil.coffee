angular.module('bxUtil', [])

.service 'bxUtil', () ->
  inherits: (ctor, superCtor) ->
    ctor.super_ = superCtor
    ctor:: = Object.create superCtor::,
      constructor:
        value: ctor
        enumerable: false
        writeable: true
        configurable: true

  extend: (one, two) ->
    one[k] = two[k] for k of two
    return one

  random: (length) ->
    token = ''
    list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm' +
      'nopqrstuvwxyz0123456789'
    while token.length < length
      token += list.charAt(Math.floor(Math.random() * list.length))
    return token

  async: (fn) ->
    setTimeout ->
      fn
    , 0
