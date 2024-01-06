var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass')(require('sass')),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    order = require('gulp-order');

var jsSources = ['js/*.js'],
    sassSources = ['sass/*.scss'],
    htmlSources = ['**/*.html'],
    outputCSSDir = 'css',
    outputDir = 'dist';

gulp.task('sass', function() {
  return gulp.src(sassSources)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(outputCSSDir))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src(jsSources)
    .pipe(order([
      'js/jquery.min.js',
      'js/jquery.easing.1.3.js',
      // ... other js files
      'js/main.js'
    ], {base: './'}))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(jsSources, gulp.series('js'));
  gulp.watch(sassSources, gulp.series('sass'));
  gulp.watch(htmlSources, gulp.series('html'));
});

gulp.task('connect', function(done) {
  connect.server({
    root: '.',
    livereload: true
  });
  done();
});

gulp.task('html', function() {
  return gulp.src(htmlSources)
    .pipe(connect.reload());
});

gulp.task('default', gulp.series('html', 'js', 'sass', 'connect', 'watch'));
