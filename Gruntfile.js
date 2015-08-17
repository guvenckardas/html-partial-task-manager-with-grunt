/**
 * Created by gkardas on 22/07/15.
 */


module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {
            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'dist/assets/',                   // Src matches are relative to this path
                    src: ['images/**/*.{png,jpg,gif}']  , // Actual patterns to match
                    dest: 'app/assets/'                  // Destination path prefix
                }]
            }
        },

        configPages: {
            src: 'app/pages/**/*.html',
            dist: 'app/pages/'
        },

        configPartials: {
            src: 'app/partials/*.html',
            dist: 'app/'
        },

        'string-replace': {


                partials: {
                    files: {
                        '<%= configPartials.dist %>': '<%= configPartials.src %>'
                    },
                    options: {
                        replacements: [{
                            pattern: /<!-- @import (.*?) -->/ig,
                            replacement: function (match, p1) {
                                return grunt.file.read(grunt.config.get('configPartials.dist') + p1);
                            }
                        }]
                    }
                },
            pages: {
                files: {
                    '<%= configPages.dist %>': '<%= configPages.src %>'
                },
                options: {
                    replacements: [{
                        pattern: /<!-- @import (.*?) -->/ig,
                        replacement: function (match, p1) {
                            return grunt.file.read(grunt.config.get('configPages.dist') + p1);
                        }
                    }]
                }
            }



        },

        copy: {
            pages: {
                expand: true,
                cwd: 'dist/pages',
                src: '**',
                dest: 'app/pages'
            },
            partials:{
                expand: true,
                cwd: 'dist/partials',
                src: '**',
                dest: 'app/partials'
            }
        },

        injector: {
             deneme:{
                 options: {
                     template: 'dist/pages/index.html',
                     relative: false,
                     ignorePath:'app/',
                     addRootSlash: false
                 },
                 files:{
                     'app/pages/index.html': ['app/assets/js/pages/*.js', 'app/assets/css/pages/*.css']
                 }
             }
        }


        });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-injector');




    grunt.registerTask('creteGlobalActions','Make Dependency Injection Actions for common',function(){
        global.basePath  = '';
        global.dest = global.basePath+'config/';
        global.route = grunt.file.readJSON(global.dest+'route.json');

        global.package = grunt.file.readJSON('package.json');
        global.version = global.package.version;
        //global.versionPath = '?v='+ global.version;
        global.versionPath = '';
        global.crypto = require('crypto');

        global.appPath = 'app/';




        global.routeIndex = {};


        global.common = {};
        global.common.javascript = [];
        global.common.css = [];

        if(grunt.file.exists('app')){
            grunt.file.delete('app')

        }

        if(!grunt.file.exists(global.dest+'route-files.json')){
            grunt.file.write(global.dest+'route-files.json','{}');
        }

    });


    grunt.registerTask('createConfigFile','Create Dependency Injection Json',function(){

        try{
            var routeFilesJson = {};
            routeFilesJson.routes = {};

            routeFilesJson.common = {};
            routeFilesJson.common.local = {};

            routeFilesJson.common.min = {};

            routeFilesJson.common.local.javascript =  global.route.common.js || "";
            routeFilesJson.common.local.css =  global.route.common.css || "";


            for(var key in  global.routeIndex){
                grunt.log.writeln(JSON.stringify(global.routeIndex[key]))
            }




            for(var i=0; i< global.route.routes.length; i++){
                var key = global.route.routes[i].route;
                routeFilesJson.routes[key] = {};
                routeFilesJson.routes[key].local = {};
                routeFilesJson.routes[key].min = {};



                routeFilesJson.routes[key].min.javascript = "";
                routeFilesJson.routes[key].min.css = "";




               routeFilesJson.routes[key].local.javascript = global.route.routes[i].pageJs;
               routeFilesJson.routes[key].local.css = global.route.routes[i].pageCss;

            }

            grunt.file.write(global.dest+'route-files.json', JSON.stringify(routeFilesJson, null, 2));

        }catch(e){
            grunt.log.writeln(e)
        }
    });

    var checkDestIsEmpty = function(arr){
        var empty = false;

        for(var i =0; i<arr.length; i++){

            if (!grunt.file.exists(arr[i])) {
                grunt.log.writeln(arr[i] + ' dosyasina erisilemiyor!')
                empty = true;
            }
        }

        return empty;
    };

    grunt.registerTask('makeUglify','Uglify Action',function(){

        try{
            var routeFiles = grunt.file.readJSON(global.dest+'route-files.json');
            var routes = routeFiles.routes;


            var makeUglify = function(target,uniqueFile,key){
                var uniqueSelector = (uniqueFile);
                var destinationJs = global.basePath+'app/assets/js/pages/'+uniqueFile+'.min.js';
                var destinationCss = global.basePath+'app/assets/css/pages/'+uniqueFile+'.min.css';

                var commonTarget = routeFiles.common.local;
                var commonTargetJs = commonTarget.javascript;
                var commonTargetCss = commonTarget.css;




                if(typeof target.javascript !== 'undefined' && target.javascript != "" ){

                    var targetJs = commonTargetJs;
                    for(var i=0; i<target.javascript.length; i++){
                        targetJs.push(target.javascript[i]);
                    }


                    grunt.config('uglify.'+uniqueSelector+'.src', targetJs);
                    grunt.config('uglify.'+uniqueSelector+'.dest', destinationJs);
                    grunt.task.run(['uglify:'+uniqueSelector]);

                    routes[key].min.javascript = destinationJs+global.versionPath;
                }


                if(typeof target.css !== 'undefined' && target.css != "" ){

                    var targetCss = commonTargetCss;
                    for(var i=0; i<target.css.length; i++){
                        targetCss.push(target.css[i]);
                    }

                    grunt.log.writeln(targetCss)
                    checkDestIsEmpty(targetCss)


                    grunt.config('cssmin.'+uniqueSelector+'.src', targetCss);
                    grunt.config('cssmin.'+uniqueSelector+'.dest', destinationCss);
                    grunt.task.run(['cssmin:'+uniqueSelector]);

                    routes[key].min.css = destinationCss+global.versionPath;
                }

            };

            for(var key in routes){
                var uniqueFile = global.crypto.createHash('md5').update(key).digest('hex');
                makeUglify(routes[key].local,uniqueFile,key);
            }

            grunt.file.write(global.dest+'route-files.json', JSON.stringify(routeFiles, null, 2));

        }catch(e){
            grunt.log.writeln(e)
        }


    });




    grunt.registerTask('injectAssets','Uglify Action',function(){




        try{
            var routeFiles = grunt.file.readJSON(global.dest+'route-files.json');
            var routes = routeFiles.routes;

            var keyAcsess = 0;
            for(var key in routes){
                keyAcsess++;
                var route = global.appPath+key;



//                var obj = {
//                    options:{
//                        template: route,
//                        relative: false,
//                        ignorePath:'app/',
//                        addRootSlash: false
//                    }
//                };
//
//                obj.files = {};
//                obj.files[route] = [routes[key].min.javascript,routes[key].min.css];


//                grunt.config('injector',obj);

                var obj = {};
                obj.files = {};
                obj.files[route.toString()] = [routes[key].min.javascript,routes[key].min.css];

                grunt.config('injector.'+keyAcsess+'.options', {
                    template: route,
                    relative: false,
                    ignorePath:'',
                    addRootSlash: false
                });

                grunt.config('injector.'+keyAcsess+'.files',obj.files );

                grunt.task.run(['injector:'+keyAcsess]);

            }


        }catch(e){
            grunt.log.writeln(e)
        }





    });




        grunt.registerTask('build', ['creteGlobalActions','createConfigFile','makeUglify','copy:pages','copy:partials','string-replace:partials','string-replace:pages','injectAssets','imagemin']);

};