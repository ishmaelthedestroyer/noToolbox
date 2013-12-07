angular.module('bxResource', ['ngResource'])

# set up lazy loading module
.config ($controllerProvider, $compileProvider, $filterProvider, $provide) ->
  @controller = $controllerProvider.register
  @directive = $compileProvider.directive
  @filter = $filterProvider.register
  @provider = $provide.provider
  @factory = $provide.factory
  @service = $provide.service

.service 'bxResource', () ->
  resources = []

  # return method
  get: (name, url, params) ->
    ###
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

    ###
    # try to find resource in resources
    return x for x in resources when x.name is name

    # if doesn't exist, create a new one
    params = { id: '@id' } if !params
    url = url || '/api/' + name.toLowerCase() + '/:id'

    resource = angular.module('bxResource').factory name, [
      '$resource', ($resource) ->
        $resource url, params
    ]

    # resource = angular.module('bx')

    resources.push resource
    return resource
