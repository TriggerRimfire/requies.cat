const gulp = require('gulp')
const sass = require('gulp-sass')
const browserify = require('gulp-browserify')
const nodemon = require('gulp-nodemon')
gulp.task('css', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
})
gulp.task('babel', () => {
  gulp.src('./src/js/index.js')
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(gulp.dest('./public/js'))
})
gulp.task('serve', ['css'], () => {
  return nodemon({script: 'app.js'})
})
