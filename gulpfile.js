// Initialize modules
const {
  src,
  dest,
  watch,
  series
} = require('gulp');

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

// Sass Task
function scssTask() {
  return (
    src('app/scss/style.scss', {
      sourcemaps: false
    })
    .pipe(sass())
    .pipe(dest('dist', {
      sourcemaps: '.'
    }))
  );
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', {
      sourcemaps: false
    })
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(terser())
    .pipe(dest('dist', {
      sourcemaps: '.'
    }));
}

function imgTask() {
  return src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
}


// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'],
    series(scssTask, jsTask, browserSyncReload)
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, imgTask, browserSyncServe, watchTask);