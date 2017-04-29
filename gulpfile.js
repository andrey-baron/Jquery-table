'use strict';
//---------------------------------------------------------
var gulp = require('gulp');
var scss = require('gulp-scss');
var less = require('gulp-less');
var concat = require("gulp-concat");
var filter = require('gulp-filter');
var order = require('gulp-order');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
var numeral = require('numeral');
//---------------------------------------------------------

//---------------------------------------------------------
var scss_dir = "src/scss/**/*.scss";
var js_dir = "src/js/**/*.js";
var css_dir_dest = "css";
var js_dir_dest = "js";
//---------------------------------------------------------



//---------------------------------------------------------
gulp.task('scss', function () {
    gulp.src(scss_dir)
        .pipe(notify("Что-то изменилось"))
        .pipe(scss())
        .pipe(concat("main.css"))
        .pipe(gulp.dest(css_dir_dest))
        .pipe(notify("Scss готов!"));
});

gulp.task('scss:watch', function () {
    gulp.watch(scss_dir, ['scss']);
});
//---------------------------------------------------------



//---------------------------------------------------------
gulp.task('main_js', function () {
    var vendors = mainBowerFiles();
    return gulp.src(js_dir)
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(js_dir_dest));
});

gulp.task('main_js:watch', function () {
    gulp.watch(js_dir, ['main_js']);
});
//---------------------------------------------------------


//---------------------------------------------------------
gulp.task('vendor_js', function () {
    var vendors = mainBowerFiles();
    return gulp.src(vendors)
        .pipe(filter('**.js'))
        .pipe(order([
            "jquery.js",
            "bootstrap.js",
            "numeral.js"
        ]))
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest(js_dir_dest));
});
//---------------------------------------------------------



//---------------------------------------------------------
gulp.task('vendor_css', function () {
    var vendors = mainBowerFiles();
    console.log(vendors);
    return gulp.src(vendors)
        .pipe(filter(['**.less', 'css']))
        .pipe(less())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(css_dir_dest))
        .pipe(notify("vendor готов!"));;
});
//---------------------------------------------------------