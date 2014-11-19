'use strict';

module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  
  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: [
          'lib/**/*.js',
          '!lib/parser.js'
        ]
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    mochacli: {
      options: {
        reporter: 'nyan',
        bail: true,
        timeout: 15000
      },
      all: ['test/*.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochacli']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochacli']
      }
    },
    peg: {
      spider: {
        src: "src/spider.pegjs",
        dest: "lib/parser.js"
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '*.js',
          excludes: ['lib/parser.js']
        },
      }
    },
    clean: {
      build: ["lib/"],
    },    
    spider_script: {
      options: {},
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.spider'],
          dest: 'lib/',
          ext: '.js'
        }]
      }
    },
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'lib/',
        }]
      }
    }
  });
    
  // Default task.
  grunt.registerTask('default', ['build', 'jshint', 'mochacli']);
  grunt.registerTask('build', ['clean:build', 'peg', 'spider_script:build', 'copy:build']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);  
};