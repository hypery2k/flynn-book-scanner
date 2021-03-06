'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    app: {
      version: require('./package.json').version || '1.4',
      build: require('./package.json').build || {},
      src: require('./bower.json').appPath || 'src',
      gen: require('./bower.json').appPath || 'src-gen',
      dist: 'www'
    },
    watch: {
      compass: {
        files: ['<%= app.src %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= app.src %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= app.src %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= app.src %>}/scripts/{,*/}*.js',
          '<%= app.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'bower_components/{,*/}*'
        ]
      }
    },
    ngdocs: {
      options: {
        dest: 'target/docs',
        html5Mode: true,
        startPage: '/api',
        title: 'Flynn Book Scanner',
      },
      api: {
        src: ['<%= app.src %>/scripts/{,*/}*.js'],
        title: 'App Documentation'
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= app.src %>',
            '.'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '<%= app.src %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '{.tmp,<%= app.src %>}/scripts/{,*/}*.js',
            '<%= app.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            'bower_components/{,*/}*'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= app.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= app.dist %>/*',
            '!<%= app.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= app.src %>/scripts/{,*/}*.js'
      ]
    },
    compass: {
      options: {
        sassDir: '<%= app.src %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= app.src %>/images',
        javascriptsDir: '<%= app.src %>/scripts',
        fontsDir: '<%= app.src %>/styles/fonts',
        importPath: 'bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    'string-replace': {
      inline: {
        files: {
          'www/': 'styles/**',
        },
        options: {
          replacements: [
            // place files inline example
            {
              pattern: /\?.*?(["|'|\)])/gi,
              replacement: '$1'
            }
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= app.src %>/index.html',
      options: {
        assetsDirs: ['<%= app.src %>/styles/{,*/}*.css', '<%= app.src %>/scripts/{,*/}*.js'],
        dest: '<%= app.dist %>'
      }
    },
    usemin: {
      html: ['<%= app.dist %>/{,*/}*.html'],
      options: {
        dirs: ['<%= app.dist %>']
      }
    },
    htmlmin: {
      dist: {
        options: {},
        files: [{
          expand: true,
          cwd: '<%= app.src %>',
          src: ['index.html'],
          dest: '<%= app.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= app.src %>',
          dest: '<%= app.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.json',
            'images/{,*/}*.*',
            'styles/fonts/*',
            'scripts/webworker*.js',
            'views/*.html',
            'templates/*.html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= app.gen %>',
          dest: '<%= app.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'config.json',
            'images/{,*/}*.*',
            'styles/fonts/*',
            '*.js'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= app.dist %>/images',
          src: [
            'generated/*'
          ]
        }, {
          expand: true,
          cwd: 'bower_components/ionic/release/fonts/',
          dest: '<%= app.dist %>/fonts',
          src: [
            '*',
          ]
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap-sass/fonts/',
          dest: '<%= app.dist %>/fonts',
          src: [
            '*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= app.src %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: [
        'compass:server',
        'copy:styles'
      ],
      test: [
        'compass',
        'copy:styles'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'htmlmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      server: {
        configFile: 'karma.conf.js',
        singleRun: false,
        autoWatch: true
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%= app.dist %>/scripts',
          src: ['*.js', '!webworker*.js'],
          dest: '<%= app.dist %>/scripts'
        }]
      }
    },
    plato: {
      report: {
        files: {
          'target/plato-report': ['<%= app.src %>/scripts/**/*.js']
        }
      }
    },
    shell: {
      options: {
        failOnError: true,
        stdout: true,
        stderr: true,
        execOptions: {
          maxBuffer: Infinity
        }
      },
      buildIOS: {
        command: 'cordova build ios --release --device'
      },
      buildAndroid: {
        command: 'cp "<%= app.build.android.ant_property_file %>" "$(pwd)/platforms/android/release-signing.properties" && cordova build android --release'
      },
      prepare: {
        command: 'cordova prepare'
      },
      buildIPA: {
        command: 'cp "/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/ResourceRules.plist" "$(pwd)/platforms/ios/build/device/Flynn.app" && xcrun -sdk iphoneos PackageApplication -v "$(pwd)/platforms/ios/build/device/Flynn.app" -o "$(pwd)/target/Flynn_<%= app.version %>.ipa" --sign "<%= app.build.ios.signer %>" --embed "<%= app.build.ios.provisionProfile %>"'
      },
      buildAPK: {
        command: 'cp "$(pwd)/platforms/android/build/outputs/apk/android-armv7-release.apk" "$(pwd)/target/Flynn_armv7_<%= app.version %>.apk" && cp "$(pwd)/platforms/android/build/outputs/apk/android-x86-release.apk" "$(pwd)/target/Flynn_x86_<%= app.version %>.apk"'
      },
      prepareNW: {
        command: 'touch "<%= app.dist %>/cordova.js" && touch "<%= app.dist %>/cordova_plugins.js"'
      }
    },
    nodewebkit: {
      options: {
        appName: "<%= app.name %>",
        appVersion: "<%= app.version %>",
        main: "index.html",
        platforms: ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'],
        buildDir: './target/desktop',
        icon: './etc/icon.png'/*,
        macIcns: './etc/icon.icns',
        winIco: './etc/icon.ico'*/
      },
      src: ['./www/**/*'] // Your node-webkit app
    }
  });

  grunt.registerTask('buildIPA', ['shell:buildIOS', 'shell:buildIPA']);
  grunt.registerTask('buildAPK', ['shell:buildAndroid', 'shell:buildAPK']);
  grunt.registerTask('buildCordova', ['shell:buildAndroid'], 'shell:buildIOS');
  grunt.registerTask('buildDesktop', ['shell:prepareNW'], 'nodewebkit');

  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngAnnotate',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'usemin',
    'ngdocs',
    'plato',
    'string-replace'
  ]);

  grunt.registerTask('release', [
    'clean:dist',
    'ngAnnotate',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'usemin',
    'string-replace'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
