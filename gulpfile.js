const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const eslint = require("gulp-eslint");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const clean = require('gulp-clean');

const { series, parallel, src, dest } = require('gulp');
const file = 'jquery.nestable';
const opt = {
  suffix: '.min',
  ext: {
    js: '.js',
    css: '.css',
    scss: '.scss',
    sass: '.sass'
  },
  path: {
    dist: 'dist/'
  }
};

function javascript (cb) {
  src(file + opt.ext.js)
    .pipe(uglify())
    .pipe(rename({suffix: opt.suffix}))
    .pipe(dest(opt.path.dist));
  cb();
}

function sassTask (cb) {
  src(file + opt.ext.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('.'))
  cb();
}

function css (cb) {
  src(file + opt.ext.css)
    .pipe(cleanCss())
    .pipe(rename({suffix: opt.suffix}))
    .pipe(dest(opt.path.dist));
  cb();
};

function test (cb) {
  src([file + opt.ext.js])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  cb();
}

function before_build (cb) {
  //src(opt.path.dist, {read: false}).pipe(clean());
  cb();
}

const build = parallel(series(sassTask, css), javascript)
  
exports.test = test;
exports.build = build;
exports.default = series(before_build, build);