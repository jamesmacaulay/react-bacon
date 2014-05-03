module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    browserify: {
      umd: {
        files: {
          'dist/react-bacon.js': './src/react-bacon.js'
        },
        options: {
          bundleOptions: {
            standalone: 'ReactBacon'
          },
          transform: ['browserify-shim']
        }
      },
      test: {
        files: {
          'tmp/specs.js': './spec/**/*_spec.js'
        },
        options: {
          alias: ['./src/react-bacon.js:react-bacon'],
          transform: ['reactify']
        }
      }
    },
    jasmine: {
      options: {
        specs: ['tmp/specs.js'],
        reporter: 'spec'
      },
      src: ['dist/react-bacon.js']
    }
  });

  grunt.registerTask('spec', ['browserify:test', 'jasmine']);
  grunt.registerTask('default', 'spec');
};
