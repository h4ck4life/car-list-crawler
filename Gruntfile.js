module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            build: {
                src: './public/src/script.js',
                dest: './public/src/script.js'
            },
        },
        uglify: {
            dist: {
                files: {
                    './public/src/script.min.js': ['./public/src/script.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');

    // Default task(s).
    grunt.registerTask('default', [
        'browserify',
        'uglify'
    ]);
};