'use strict';

module.exports = function() {
  $.gulp.task('pug', function() {
    //require относительно node_modules
    //let locals = require('../../content.json');
    return $.gulp.src('./source/template/pages/*.pug')
      .pipe($.gp.pug({ pretty: true }))
      .on('error', $.gp.notify.onError(function(error) {
        return {
          //locals : JSON.parse($.fs.readFileSync('./content.json', 'utf8')),
          //locals : locals,
          title: 'Pug',
          message:  error.message
        }
       }))
      .pipe($.gulp.dest($.config.root));
  });
};
