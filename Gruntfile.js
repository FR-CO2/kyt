/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    "target/classes/public/scripts/bundle.js": "src/main/resources/public/scripts/app/**/*.js"
                },
                options: {
                    debug: false,
                    transform: ['uglifyify']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify']);
    grunt.registerTask('build', ['browserify']);

};


