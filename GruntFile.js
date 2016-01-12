/**
 * Created by ritz078 on 14/05/15.
 */

module.exports=function(grunt){
    grunt.initConfig({
        browserify:{
            dist:{
                options:{
                    transform:[['babelify',{'loose':"all"}]]
                },
                files: {
                    './dist/jb_vm-debug.js':['./src/js/jb_vm.js']
                }
            }
        },
        watch:{
            scripts:{
                files:['./src/js/*.js'],
                tasks:['browserify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default',["watch"]);
    grunt.registerTask('build',["browserify"]);
};

