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

    browserify: {
      main: {
        files: {
          'index.min.js': ['index.js']
        },
        options: {
          plugin: [
            [ "browserify-derequire" ],
            [ "bundle-minify" ]
          ],
          browserifyOptions: {
            standalone: 'name'
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['eslint', 'browserify']);
}
