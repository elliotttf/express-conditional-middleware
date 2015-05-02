var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var nodeunit = require('gulp-nodeunit');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('lint', function () {
  return gulp.src([
    './lib/**/*.js',
    './test/**/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', [ 'lint' ], function (cb) {
  gulp.src([
    './lib/**/*.js'
  ])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src('test/index.js')
        .pipe(nodeunit({
          reporter: 'default'
        }))
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', cb);
    });
});

