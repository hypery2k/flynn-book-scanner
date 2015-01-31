'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.initConfig({
  	app:{
  		version: require('./package.json').version || '1.0',  		
  		build: require('./package.json').build || {}
  	},
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'src',
      gen: require('./bower.json').appPath || 'src-gen',
      dist: 'www'
    },
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
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
        src: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
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
            '<%= yeoman.app %>',
            '.'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '<%= yeoman.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            'bower_components/{,*/}*'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
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
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
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
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    htmlmin: {
      dist: {
        options: {},
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['index.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'config.json',
            'images/{,*/}*.*',
            'styles/fonts/*',
            'scripts/webworker*.js',
            '*.js',
            'views/*.html',
            'templates/*.html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.gen %>',
          dest: '<%= yeoman.dist %>',
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
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }, {
          expand: true,
          cwd: 'bower_components/ionic/release/fonts/',
          dest: '<%= yeoman.dist %>/fonts',
          src: [
            '*',
          ]
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap-sass/fonts/',
          dest: '<%= yeoman.dist %>/fonts',
          src: [
            '*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
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
	    command: 'cp "<%= app.build.android.ant_property_file %>" "$(pwd)/platforms/android/ant.properties" && cordova build android --release'
	  },
	  prepare: {
	    command: 'cordova prepare'
	  },
	  buildIPA: {
	    command: 'cp "/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/ResourceRules.plist" "$(pwd)/platforms/ios/build/device/Flynn.app" && xcrun -sdk iphoneos PackageApplication -v "$(pwd)/platforms/ios/build/device/Flynn.app" -o "$(pwd)/dist/Flynn_<%= app.version %>.ipa" --sign "<%= app.build.ios.signer %>" --embed "<%= app.build.ios.provisionProfile %>"'
	  },
	  buildAPK: {
	    command: 'cp "$(pwd)/platforms/android/ant-build/Flynn-release.apk" "$(pwd)/dist/Flynn_<%= app.version %>.apk"'
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
                cwd: '<%= yeoman.dist %>/scripts',
                src: ['*.js','!webworker*.js'],
                dest: '<%= yeoman.dist %>/scripts'
              }]
        }
    },
    plato: {
      report: {
        files: {
          'target/plato-report': ['<%= yeoman.app %>/scripts/**/*.js']
        }
      }
    }
  });

  grunt.registerTask('buildIPA', ['shell:buildIOS','shell:buildIPA']);
  grunt.registerTask('buildAPK', ['shell:buildAndroid','shell:buildAPK']);
  grunt.registerTask('buildCordova', ['shell:buildAndroid'],'shell:buildIOS');

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
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'usemin',
    'ngdocs',
    'plato'
  ]);

  grunt.registerTask('release', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'ngAnnotate',
    'cssmin',
    'usemin',
    'ngdocs',
    'plato',
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};