/**
 * Report template file builder.
 * @module gulp/tasks/report-file
 */

import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gulpPlumber from 'gulp-plumber';
import gulpCssmin from 'gulp-cssmin';
import gulpHtmlmin from 'gulp-htmlmin';
import gulpUglify from 'gulp-uglify';
import gulpSourcemaps from 'gulp-sourcemaps';
import babelify from 'babelify';
import browserify from 'browserify';
import vinylBuffer from 'vinyl-buffer';
import vinylSourceStream from 'vinyl-source-stream';
import gulpPostcss from 'gulp-postcss';
import postcssCustomProperties from 'postcss-custom-properties';
import autoprefixer from 'autoprefixer';
import postcssExtend from 'postcss-extend';
import postcssImport from 'postcss-import';

import notify from '../helpers/notify';
import {inlineScripts, inlineStyles} from '../helpers/inline';
import {env, src, dest, browsers} from '../config';

/**
 * Returns a processed stream of critical styles.
 * @return {Stream} Processed critical styles stream.
 */
function streamCriticalStyles() {
  return gulp
    .src(src.stylesMain)
    .pipe(gulpPlumber(notify.andEndStream))
    .pipe(gulpPostcss([
      postcssImport(),
      autoprefixer({browsers}),
      postcssCustomProperties(),
      postcssExtend()
    ]))
    .pipe(gulpIf(env.needsMinification, gulpCssmin()));
}

/**
 * Returns a processed stream of critical scripts.
 * @return {Stream} Processed critical scripts stream.
 */
function streamCriticalScripts() {
  return browserify()
    .add(src.scriptsMain)
    .transform(babelify)
    .bundle()
    .on('error', notify.andEndStream)
    .pipe(vinylSourceStream('inline.js'))
    .pipe(gulpPlumber(notify.andEndStream))
    .pipe(vinylBuffer())
    .pipe(gulpIf(env.needsMinification, gulpUglify()))
    .pipe(gulpIf(env.needsSourcemaps, gulpSourcemaps.init({loadMaps: true})))
    .pipe(gulpIf(env.needsSourcemaps, gulpSourcemaps.write()));
}

/**
 * Builds the report template file.
 * @param  {Function} [done] Optional done callback (not used).
 * @return {Stream}          Generated index file stream.
 */
export default function reportFileTask() {
  return gulp
    .src(src.htmlIndex)
    .pipe(inlineStyles(streamCriticalStyles()))
    .pipe(inlineScripts(streamCriticalScripts()))
    .pipe(gulpIf(env.needsMinification, gulpHtmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(dest.root));
}
