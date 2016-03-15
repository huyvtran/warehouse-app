var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rev = require('gulp-rev-mtime');
// var rename = require("gulp-rename");

var templateCache = require('gulp-angular-templatecache');
 
gulp.task('default', function () {
    gulp.src('www/app/**/*.html')
        .pipe(templateCache({ module:'templatesCache', standalone:true}))
        .pipe(gulp.dest('www/')).on('end', function() {
            gulp.src(['www/app/**/*.js', '!www/app/**/MockUpdateService.js','!www/app/app-ios.js'])
                .pipe(concat('app.js'))

                .pipe(gulp.dest('www/')).on('end', function() {
                    gulp.src(['www/app/**/*.js', '!www/app/**/UpdateService.js','!www/app/app.js'])
                        .pipe(concat('app-ios.js'))
                        .pipe(gulp.dest('www/')).on('end', function() {
                            gulp.src(['www/index-ios.html'])
                                .pipe(rev({cwd:'www/'}))
                                .pipe(gulp.dest('www/'));
                        })
                })
        })

});