module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            build: {
                src: './public/src/script.js',
                dest: './public/src/script.js'
            },
            options: {
                exclude: [
                    '@tensorflow/tfjs',
                    '@tensorflow/tfjs-vis',
                    'papaparse',
                ],
                plugin: [
                    ['tsify', {
                        target: 'es6',
                        removeComments: true,
                        preserveConstEnums: true,
                    }]
                ],
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', [
        'browserify'
    ]);
};