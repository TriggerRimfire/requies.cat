const gulp = require('gulp')
const sass = require('gulp-sass')
const nodemon = require('gulp-nodemon')
gulp.task('css', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
})
gulp.task('serve', ['css'], () => {
  return nodemon({script: 'app.js'})
})
