'use strict';

module.exports = function() {
  $.gulp.task('js:process', function() {
    return $.gulp.src($.path.app)
      .pipe($.gp.sourcemaps.init())
      .pipe($.gp.babel({
          presets: ['env']
        }))
      .pipe($.gp.concat('app.js'))
      .pipe($.gp.sourcemaps.write())
      .pipe($.gp.eslint())
      .pipe($.gp.eslint.format())
      //.pipe($.gp.webpack($.gulp.webpackConfig, $.gulp.webpack))
      .pipe($.gulp.dest($.config.root + '/assets/js'))
  })
};