'use strict';

//------------------------------------------------------------------------------
// modules
//
const gulp = require('gulp'),
      watch = require('gulp-watch'),
      babel = require('gulp-babel'),
      sourcemaps = require('gulp-sourcemaps'),
      eslint = require('gulp-eslint'),
      flow = require('gulp-flowtype'),
      del = require('del'),
      karma = require('karma'),
      rename = require('gulp-rename'),
      path = require('path'),
      util = require('gulp-util');

/* eslint-disable no-unused-vars */
/* This const are not used in this gulpfile. This is just a workaround for
 * npm-check and modules used by karma.
 */
const babelify = require('babelify'),
      browserify = require('browserify'),
      browserifyIstanbul = require('browserify-istanbul'),
      watchify = require('watchify');
/* eslint-enable no-unused-vars */

//------------------------------------------------------------------------------
// config
//
const allJs = '**/*.js',
      mainFileName = 'fizz.js',
      exclude = {
        nodeModules: '!node_modules/**',
        dist: '!dist/**',
        coverage: '!coverage/**'
      },
      src = {
        'main': path.join('src', mainFileName),
        'js': path.join('src', allJs),
        'test': path.join('test', allJs)
      },
      dist = 'dist/',
      coverage = 'coverage/',
      options = {
        // babel: see .babelrc
        flow: {},
        karma: {
          configFile: path.join(__dirname, 'karma.conf.js')
        }
      };

//------------------------------------------------------------------------------
// globals
//
const MODE = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  PUBLISH: 'publish'
};

let mode = MODE.DEVELOPMENT;

function isDevelopmentMode() {
  return mode === MODE.DEVELOPMENT;
}

//------------------------------------------------------------------------------
// util
//
function clear(done) {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  if(done) done();
}

//------------------------------------------------------------------------------
// check
//
gulp.task('check:eslint', checkEslint);
function checkEslint() {
  let src = [allJs, exclude.nodeModules, exclude.dist, exclude.coverage];
  let stream = gulp.src(src)
    .pipe(eslint({
      rules: {
        'no-console': isDevelopmentMode() ? 'off' : 'error'
      }
    }))
    .pipe(eslint.format());

  if (!isDevelopmentMode()) {
    stream.pipe(eslint.failAfterError())
  }

  return stream;
}

gulp.task('check:flow', checkFlow);
function checkFlow() {
  options.flow.abort = isDevelopmentMode() ? false : true;
  return gulp.src([src.js, src.test])
    .pipe(flow(options.flow));
}

//------------------------------------------------------------------------------
// build: javascript: ES6 -> babel -> ES5
//
gulp.task('build:js', buildJs);
function buildJs() {
  return gulp.src(src.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    // .pipe(sourcemaps.write(".")) // external soure map
    .pipe(sourcemaps.write()) // internal soure map
    .pipe(gulp.dest(dist));
}

gulp.task('copy:flow', copyFlow);
function copyFlow() {
  return gulp.src(src.js)
    .pipe(rename({'extname': '.js.flow'}))
    .pipe(gulp.dest(dist));
}

//------------------------------------------------------------------------------
// test
//
gulp.task('test', gulp.series(testKarma));
function testKarma(done) {
  new karma.Server({
    configFile: options.karma.configFile,
    singleRun: true
  }, done).start();
}

//------------------------------------------------------------------------------
// change mode
//
gulp.task('mode:publish', changeMode(MODE.PUBLISH));
function changeMode(newMode) {
  return function(done) {
    mode = newMode;
    done();
  }
}


//------------------------------------------------------------------------------
// main tasks
//
gulp.task('clean', clean);
function clean() {
  return del([dist, coverage]);
}

gulp.task('build',
  gulp.series( 'clean',
    gulp.parallel('build:js')
  )
);

gulp.task('check', gulp.series('check:eslint', 'check:flow'));

gulp.task('watch:check', watchCheck);
function watchCheck(done) {
  let src = [allJs, exclude.nodeModules, exclude.dist, exclude.coverage];
  watch(src, function() {
    clear();
    checkEslint();
    checkFlow();
  });
  done();
}

gulp.task('publish',
  gulp.series('mode:publish', 'clean', 'check', 'build:js', 'copy:flow'));

gulp.task('default', function(done) {
  util.log('Available tasks: build, check, ,test, clean');
  done();
});
