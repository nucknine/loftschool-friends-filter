'use strict';

//глобальный объект доступ к нему есть во всех файлах модулях
global.$ = {
  package: require('./package.json'),
  config: require('./gulp/config'),
  //пути
  path: {
    task: require('./gulp/paths/tasks.js'),
    jsFoundation: require('./gulp/paths/js.foundation.js'),
    cssFoundation: require('./gulp/paths/css.foundation.js'),
    app: require('./gulp/paths/app.js')
  },
  gulp: require('gulp'),
  del: require('del'),
  //fs : require('fs'),
  browserSync: require('browser-sync').create(),
  gp: require('gulp-load-plugins')(),
  //webpackmain : require('webpack'),
  //webpackConfig : require('./webpack.config.js')
};

//подключение всех тасков в файл
$.path.task.forEach(function(taskPath) {
  require(taskPath)();
});

//порядок выполнения задач
$.gulp.task('default', $.gulp.series(
  'clean',
  'sprite:svg',
  //2ая задача внутри несколько параллельных
  $.gulp.parallel(
    'sass',
    'pug',
    'js:foundation',
    'js:process',
    'copy:image',
    'css:foundation',
    'copy:fonts'
  ),
  //3ая задача внутри несколько параллельных
  $.gulp.parallel(
    'watch',
    'serve'
  )
));