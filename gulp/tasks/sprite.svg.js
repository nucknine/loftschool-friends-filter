'use strict';

module.exports = function() {
  $.gulp.task('sprite:svg', function() {
    //путь до источника всех иконок svg
    return $.gulp.src('./source/images/icons/*.svg')
      .pipe($.gp.svgmin({
        js2svg: {
          pretty: true
        }
      }))
      // remove all fill, style and stroke declarations in out shapes
      .pipe($.gp.cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
      }))
      .pipe($.gp.replace('&gt;', '>'))
      // build svg sprite
      .pipe($.gp.svgSprite({
        mode: {
          symbol: {
            sprite: '../../sprites/sprite.svg',
            render: {
              scss: {
                  //куда нужно генерировать стили для спрайта
                  // Этот файл подключается в главный scss файл.
                  // Путь задается относительно файла sprite.svg, который был создан выше (в директории build)
                dest:'../../../../../source/style/common/_svgsprite.scss',
                  //код шаблона, на основе которого будут генерироваться стили для спрайта.
                  // Путь задается относительно корня
                template: './source/style/common/_sprite_template.scss'
              }
            }
          }
        }
      }))
      //переносим спрайт в директорию build
      .pipe($.gulp.dest($.config.root + '/assets/img/icons'));
  });
};
