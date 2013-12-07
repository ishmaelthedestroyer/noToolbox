angular.module('bxResource', ['ngResource']).config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
  this.controller = $controllerProvider.register;
  this.directive = $compileProvider.directive;
  this.filter = $filterProvider.register;
  this.provider = $provide.provider;
  this.factory = $provide.factory;
  return this.service = $provide.service;
}).service('bxResource', function() {
  var resources;
  resources = [];
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

      var resource, x, _i, _len;
      for (_i = 0, _len = resources.length; _i < _len; _i++) {
        x = resources[_i];
        if (x.name === name) {
          return x;
        }
      }
      if (!params) {
        params = {
          id: '@id'
        };
      }
      url = url || '/api/' + name.toLowerCase() + '/:id';
      resource = angular.module('bxResource').factory(name, [
        '$resource', function($resource) {
          return $resource(url, params);
        }
      ]);
      resources.push(resource);
      return resource;
    }
  };
});
