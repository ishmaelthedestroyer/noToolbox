doctype 5
html 'ng-controller':'AppCtrl', preventrightclick:'false', ->
  head ->
    title 'Topolabs | 3D Rendering + Printing'
    meta name:'description', content:'Topolabs | 3D Rendering + Printing'
    meta charset:'utf-8'
    link media:'screen', rel:'stylesheet', href: '/assets/css/vendor.css'
    link media:'screen', rel:'stylesheet', href: '/assets/css/app.css'
    script src:'/socket.io/socket.io.js'
    script src:'/assets/js/vendor.js'
    script src:'/assets/js/app.js'
  body '.full-screen',  ->
    div '.notification-container.ng-cloak', ->
      div class:'alert alert-dismissable alert-{{notification.type}}',
      'ng-repeat':'notification in notifications', ->
        button '.close', type:'button', 'aria-hidden':'true',
        'ng-click':'removeNotification($index)', ->
          text '&times;'
        text '{{notification.message}}'

    div '.loading-container.ng-cloak', 'ng-class':'{hidden: queue.length == 0}', ->

    nav '.navbar.navbar-fixed-top', role: 'navigation', ->
      div '.container', ->
        div '.navbar-header', ->
          button '.navbar-toggle', type: 'button', 'data-toggle': 'collapse', 'data-target': '#navbar-collapse-1', ->
            span '.sr-only', 'Toggle navigation'
            span '.icon-bar', ->
            span '.icon-bar', ->
            span '.icon-bar', ->
          a '.navbar-brand.text-white', href: '/', ->
            img '.logo', src:'/assets/img/logo-orange.png'
            em 'topo 3d'
        div '#navbar-collapse-1.collapse.navbar-collapse', ->
          form '.navbar-form.form-inline.navbar-left', style:'width:300px;', role: 'search', ->
            div '.input-group', ->
              input '.form-control.input-sm', type: 'text', placeholder: '...'
              span '.input-group-btn', ->
                button '.btn.btn-default.btn-sm.bg-orange', type: 'button', ->
                  span '.glyphicon.glyphicon-search', style:'color: #fff;', ->
          ul '.nav.navbar-nav.navbar-right', ->
            li ->
              a href: '/404', ->
                em '404'
            li ->
              a href: '/contact', ->
                em 'contact'
            li '.dropdown', ->
              a '.dropdown-toggle.text-white', href: '#', 'data-toggle': 'dropdown', ->
                em 'account'
                b '.caret', ->
              ul '.dropdown-menu', ->
                li '.ng-cloak', 'ng-hide':'loggedIn', ->
                  a href: '/login', ->
                    em 'login'
                li '.ng-cloak', 'ng-hide':'loggedIn', ->
                  a href: '/signup', ->
                    em 'signup'

                li '.ng-cloak', 'ng-hide':'!loggedIn',->
                  a href: '/dashboard', ->
                    em 'dashboard'
                li '.divider.ng-cloak', 'ng-hide':'!loggedIn', ->
                li '.ng-cloak', 'ng-hide':'!loggedIn', 'ng-click':'logout($event)', ->
                  a href: '/logout', ->
                    em 'logout'

    div '.clear-50', ->
    div '.full-screen', 'ui-view':' ', ->
      div '.loading-large', ->

    div '.clear-20', ->
