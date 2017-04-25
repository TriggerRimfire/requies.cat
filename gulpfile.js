const gulp = require('gulp')
const sass = require('gulp-sass')
const browserify = require('gulp-browserify')
const nodemon = require('gulp-nodemon')
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const minifycss = require('gulp-minify-css');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const neat = require('node-neat');
const reload = browserSync.reload;
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

gulp.task('sass', () => {
  gulp.src('./src/scss/*.scss')
  .pipe(sass({includePaths: ['scss'].concat(neat)}))
  .pipe(gulp.dest('./public/css'))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.stream())
})

gulp.task('bs-reload', () => {
  browserSync.reload()
})

gulp.task('browser-sync', () => {
  browserSync.init(['./public/*.css'], {
    proxy: "localhost:8080",
    port: 5000,
    open:'external',
    host:'node.dev6.dnovo-dev.eu',
    socket: {
    domain: 'http://node.dev6.dnovo-dev.eu'
    },
    notify:false,
    ghost:false

  })
})

gulp.task('default', ['sass', 'browser-sync'], () => {
  nodemon({script: 'app.js'})
  gulp.watch(['./src/scss/**'], ['sass'])
  gulp.watch(['./public/**'], ['bs-reload'])
})
