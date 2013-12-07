module.exports = (grunt) ->
  # config
  fileConfig =
    dir:
      tmp: 'tmp/'
      dist: 'dist/'

    dist:
      client: 'dist/public/assets/js/app.js'
      css: 'dist/public/assets/css/style.css'
      vendorJS: 'dist/public/assets/js/vendor.js'
      vendorCSS: 'dist/public/assets/css/vendor.css'

    files:
      meta: [
        'bower.json'
        'package.json'
        '.bowerrc'
        '.gitignore'
        '.nodemonignore'
        '.jshintrc'
      ]
      server: [
        '*'
        'lib/*',
        'app/bin/*'
        'app/models/*'
        'app/controllers/*'
        'config/**/*'
      ]
      client: [
        'public/assets/js/app.*'
        'public/assets/js/routes.*'
        'public/assets/js/**/*'
        'public/routes/**/state.*'
        'public/routes/**/controllers/*'
        'public/common/js/**/lib/*.*'
        'public/assets/js/bootstrap.*'
      ]
      html: [
        'public/index.html.*'
        'public/routes/**/**.html.*'
      ]
      css: [
        'public/common/css/style.css'
        'public/assets/css/style.css'
      ]
      favicon: [
        'public/favicon.ico'
      ]
      img: [
        'public/common/img/**/*.*'
        'public/common/img/*.*'
        'public/assets/img/*.*'
        'public/assets/img/icons/*.*'
      ]
      fonts: [
        'public/common/css/fonts/**'
        'public/assets/vendor/bootstrap/dist/fonts/*.*'
      ]
      vendor:
        css: [
          'public/assets/vendor/bootstrap/dist/css/bootstrap.css'
        ]
        js: [
          'public/assets/vendor/jquery/jquery.js'
          'public/assets/vendor/angular/angular.js'
          'public/assets/vendor/angular-ui-router/release/angular-ui-router.js'
          'public/assets/vendor/angular-resource/angular-resource.js'
          'public/assets/vendor/bootstrap/dist/js/bootstrap.js'
          'public/assets/vendor/angular-bootstrap/ui-bootstrap.js'
          'public/assets/vendor/angular-bootstrap/ui-bootstrap-tpls.js'
          'public/assets/vendor/x-editable/dist/bootstrap3-editable/' +
            'js/bootstrap-editable.js'
          'public/assets/vendor/requirejs/require.js'
        ]
      all: []
      clientTmp: []

  for file in fileConfig.files.client
    fileConfig.files.clientTmp.push 'tmp/'+file

  fileConfig.files.all.push file for file in fileConfig.files.server
  fileConfig.files.all.push file for file in fileConfig.files.client
  fileConfig.files.all.push file for file in fileConfig.files.html
  fileConfig.files.all.push file for file in fileConfig.files.css
  fileConfig.files.all.push file for file in fileConfig.files.vendor.css
  fileConfig.files.all.push file for file in fileConfig.files.vendor.js

  # load tasks
  require('load-grunt-tasks')(grunt)

  # task config
  taskConfig =
    # `package.json` file read to access meta data
    pkg: grunt.file.readJSON 'package.json'

    # banner placed at top of compiled source files
    meta:
      '/** \n' +
      ' * <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * <%= pkg.homepage %> \n' +
      ' * \n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      '<%= pkg.author %>\n' +
      ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
      ' * */\n'

    concurrent:
      dev:
        options:
          logConcurrentOutput: true
        tasks: [
          'watch'
          'nodemon:dev'
        ]

    nodemon:
      dev:
        options:
          file: '<%= dir.dist %>app.js'

    # watch files for changes
    watch:
      server:
        files: [
          '<%= files.server %>'
        ]
        tasks: [
          'build:server'
        ]
      client:
        files: [
          '<%= files.client %>'
          '<%= files.html %>'
          '<%= files.vendor.js %>'
        ]
        tasks: [
          'build:client'
        ]
      css:
        tasks: [
          'build:css'
        ]
        files: [
          '<%= files.css %>'
          '<%= files.vendor.css %>'
        ]
      assets:
        tasks: [
          'build:assets'
        ]
        files: [
          '<%= files.img %>'
          '<%= files.fonts %>'
          '<%= files.favicon %>'
        ]

    # creates changelog on a new version
    changelog:
      options:
        dest: 'CHANGELOG.md'
        template: 'changelog.tpl'

    # increments version number, etc
    bump:
      options:
        files: [
          'package.json'
          'bower.json'
        ]
        commit: true
        commitMessage: 'chore(release): v%VERSION%'
        commitFiles: [
          'package.json'
          'bower.json'
        ]
        createTag: false
        tagName: 'v%VERSION%'
        tagMessage: 'Version %VERSION%'
        push: false
        pushTo: 'origin'

    # directories to clean when `grunt clean` is executed
    clean:
      tmp: [
        '<%= dir.tmp %>'
      ]
      dist: [
        '<%= dir.dist %>'
      ]
      server:
        expand: true
        cwd: '<%= dir.dist %>'
        src: [
          '<%= files.meta %>'
          '<%= files.server %>'
        ]
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'js'
      client:
        expand: true
        cwd: '<%= dir.dist %>'
        src: [
          '<%= dist.client %>'
          '<%= dist.vendorJS %>'
        ]
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'js'
      html:
        expand: true
        cwd: '<%= dir.dist %>'
        src: [
          '<%= files.html %>'
        ]
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'html'
      css:
        src: [
          '<%= dist.css %>'
          '<%= dist.vendorCSS %>'
        ]
      assets:
        src: [
          '<%= dir.dist %>public/assets/css/fonts/**'
          '<%= dir.dist %>public/assets/img/'
          '<%= dir.dist %>public/favicon.ico'
        ]

    copy:
      meta:
        files: [
          src: [
            '<%= files.meta %>'
          ]
          dest: '<%= dir.dist %>'
          cwd: '.'
          expand: true
          flatten: true
        ]
      fonts:
        files: [
          src: [
            '<%= files.fonts %>'
          ]
          dest: '<%= dir.dist %>public/assets/fonts/'
          expand: true
          flatten: true
        ]
      img:
        files: [
          src: [
            '<%= files.img %>'
          ]
          dest: '<%= dir.dist %>public/assets/img/'
          cwd: '.'
          expand: true
          flatten: true
        ]
      favicon:
        files: [
          src: [
            '<%= files.favicon %>'
          ]
          dest: '<%= dir.dist %>public/'
          cwd: '.'
          expand: true
          flatten: true
        ]
      vendor:
        files: [
          src: [
            '<%= files.vendor.js %>'
          ]
          dest: '<%= dir.dist %>public/assets/js/vendor.js'
          cwd: '.'
          expand: true
        ]


    # compile coffeescript files
    coffee:
      server:
        options:
          bare: true
        expand: true
        cwd: '.'
        src: [
          '<%= files.server %>'
        ]
        dest: '<%= dir.dist %>'
        ext: '.js'
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'coffee'
      client:
        options:
          bare: true
        expand: true
        cwd: '.'
        src: [
          '<%= files.client %>'
        ]
        dest: '<%= dir.tmp %>'
        ext: '.js'
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'coffee'

    # compile coffeecup
    coffeecup:
      views:
        expand: true
        cwd: '.'
        src: [
          '<%= files.html %>'
        ]
        dest: '<%= dir.dist %>'
        ext: '.html'

    # lint + minify CSS
    recess:
      vendor:
        src: [
          '<%= files.vendor.css %>'
        ]
        dest: '<%= dir.dist %>public/assets/css/vendor.css'
        options:
          compile: true
          compress: false
          noUnderscores: false
          noIDs: false
          zeroUnits: false
      app:
        src: [
          '<%= files.css %>'
        ]
        dest: '<%= dir.dist %>public/assets/css/app.css'
        options:
          compile: true
          compress: false
          noUnderscores: false
          noIDs: false
          zeroUnits: false

    concat:
      client:
        src: [
          '<%= files.clientTmp %>'
        ]
        dest: '<%= dist.client %>'
        filter: 'isFile'

      vendor:
        src: [
          '<%= files.vendor.js %>'
        ]
        dest: '<%= dist.vendorJS %>'

    uglify:
      app:
        options:
          banner: '/* <%= meta %> '
        files:
          '<%= dir.dist %>assets/js/app.min.js': [
            '<%= dir.dist %>'
          ]

    # lint *.js files
    jshint:
      server:
        expand: true
        jshintrc: '.jshintrc'
        cwd: '<%= dir.dist %>'
        src: [
          '<%= files.server %>'
        ]
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'js'

      client:
        jshintrc: '.jshintrc'
        src: [
          '<%= dir.dist %>assets/js/app.js'
          '<%= dir.dist %>assets/js/app.min.js'
        ]

    # lint *.coffee files
    coffeelint:
      gruntfile:
        files:
          src: [
            'Gruntfile.coffee'
          ]

      server:
        src: [
          '<%= files.server %>'
        ]
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'coffee'

      client:
        src: [
          '<%= files.client %>'
        ]
        filter: (filename) ->
          split = filename.split '.'
          ext = split[split.length - 1]
          return ext is 'coffee'

  # merge, init config
  grunt.initConfig(grunt.util._.extend(taskConfig, fileConfig))

  grunt.registerTask 'default', [
    'concurrent:dev'
  ]

  grunt.registerTask 'build:server', [
    'clean:server'

    'coffeelint:server'
    'coffee:server'

    'copy:meta'
    # 'jshint:server'
  ]

  grunt.registerTask 'build:client', [
    'clean:client'
    'clean:html'

    'coffeelint:client'
    'coffee:client'

    'concat:client'
    'concat:vendor'

    'coffeecup'

    'clean:tmp'
    # 'jshint:client'
  ]

  grunt.registerTask 'build:css', [
    'clean:css'

    'recess:app'
    'recess:vendor'
  ]

  grunt.registerTask 'build:assets', [
    'clean:assets'

    'copy:fonts'
    'copy:img'
    'copy:favicon'
  ]

  grunt.registerTask 'build', [
    'clean:tmp'
    'clean:dist'

    'build:server'
    'build:client'
    'build:css'
    'build:assets'

    'clean:tmp'
  ]

  grunt.registerTask 'build:prod', [
    'build'

    'changelog'
    'bump'
  ]

  ###
  grunt.registerTask 'lint', [
    'jshint'
    'coffeelint'
  ]

  grunt.registerTask 'build:prod', [
    'lint'
    'clean:tmp'
    'clean:dist'
    'compile'
    'copy:meta'
    'copy:fonts'
    'copy:img'
    'copy:favicon'
    'concat:app'
    'concat:vendor'
    'recess:app'
    'recess:vendor'
    'clean:tmp'
    'changelog'
    'bump'
  ]
  ###
