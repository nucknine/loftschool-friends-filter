'use strict';
//копирует изображения из source в build
module.exports = function() {
  $.gulp.task('copy:image', function() {
    return $.gulp.src('./source/images/**/*.*', { since: $.gulp.lastRun('copy:image') })
      .pipe($.gp.imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}]
          //, use: [$.gp.pngquant()]
      }))
      .pipe($.gulp.dest($.config.root + '/assets/img'));
  });
};
