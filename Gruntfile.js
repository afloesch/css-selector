module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        configFile: 'eslint.json'
      },
      target: ['src', 'Gruntfile']
    },

    mocha_phantomjs: {
      all: ['test/**/*.html']
    },

    urequire: {
      _defaults: {
        path: 'src',
        main: 'listener'
      },
      main: {
        template: 'combined',
        dstPath: 'index.js'
      },
      min : {
        template: 'combined',
        dstPath: 'index.min.js',
        optimize: 'uglify2'
      }
    }
  });

  grunt.registerTask('default', ['eslint', 'urequire']);
}
