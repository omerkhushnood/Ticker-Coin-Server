'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    dotenv = require('dotenv')
;

gulp.task('load-env', function(cb){

    dotenv.config();
    cb();
});

gulp.task('serve-dev', ['load-env'], function(){

    return nodemon({

        script: 'src/index.js',
        watch: ['src/api/', 'src/ccxt/', 'src/index.js']
    });
});

gulp.task('default', ['load-env','serve-dev']);