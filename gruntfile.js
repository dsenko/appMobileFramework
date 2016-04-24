var gruntext = {
    concatFiles: {

        appFramework: [
            './app/system.js',
            './app/component.js',
            './app/config.js',
            './app/controller.js',
            './app/cordova.js',
            './app/crud.js',
            './app/database.js',
            './app/enumerator.js',
            './app/events.js',
            './app/global.js',
            './app/message.js',
            './app/modal.js',
            './app/model.js',
            './app/plugins.js',
            './app/query.js',
            './app/rest.js',
            './app/service.js',
            './app/util.js',
            './app/mock.js',
            './app/renderer.js'
        ]

    }

}

module.exports = function (grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        clean: [
            './dist'
        ],

        copy: {
            base: {
                files: [
                    {
                        expand: true,
                        cwd: './bower_components/bootstrap/dist/css/',
                        src: ['bootstrap.min.css'],
                        dest: './dist/css/'
                    },
                    {
                        expand: true,
                        cwd: './bower_components/bootstrap/dist/js/',
                        src: ['bootstrap.min.js'],
                        dest: './dist/js/'
                    },
                    {expand: true, cwd: './bower_components/jQuery/dist/', src: ['jquery.min.js'], dest: './dist/js/'},
                    {expand: true, cwd: './bower_components/bootstrap/dist/fonts/', src: ['**'], dest: './dist/fonts/'}
                ],
            },

        },

        concat: {

            options: {
                separator: '',
            },

            appFrameworkProd: {

                src: gruntext.concatFiles.appFramework,
                dest: './dist/appFramework.min.js',


            },

            appFrameworkDev: {

                src: gruntext.concatFiles.appFramework,
                dest: './js/appFramework.min.js',


            },

        },

        uglify: {
            options: {
                mangle: false
            },
            appFramework: {
                files: {
                    './dist/appFramework.min.js': './dist/appFramework.min.js',
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [

                    {expand: true, cwd: './develop/app/', src: ['**/*.html'], dest: './www/view/'},

                ]
            },
        },


    });


    /* production */
    grunt.registerTask('build', ['clean', 'concat:appFrameworkProd', 'copy', 'uglify:appFramework' ]);

    /* development  */
    grunt.registerTask('dev', ['clean', 'concat:appFrameworkDev', 'copy']);


};