angular.module('bxUtil', []).service('bxUtil', function() {
  return {
    inherits: function(ctor, superCtor) {
      ctor.super_ = superCtor;
      return ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writeable: true,
          configurable: true
        }
      });
    },
    extend: function(one, two) {
      var k;
      for (k in two) {
        one[k] = two[k];
      }
      return one;
    },
    random: function(length) {
      var list, token;
      token = '';
      list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm' + 'nopqrstuvwxyz0123456789';
      while (token.length < length) {
        token += list.charAt(Math.floor(Math.random() * list.length));
      }
      return token;
    },
    async: function(fn) {
      return setTimeout(function() {
        return fn;
      }, 0);
    }
  };
});
