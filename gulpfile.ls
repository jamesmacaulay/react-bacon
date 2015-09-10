gulp       = require 'gulp'
gutil      = require 'gulp-util'
livescript = require 'gulp-livescript'
sourcemaps = require 'gulp-sourcemaps'

gulp.task 'default', ->
  gulp.src './src/*.ls'
  .pipe sourcemaps.init()
  .pipe livescript bare: true .on('error', gutil.log)
  .pipe sourcemaps.write('./maps')
  .pipe gulp.dest('./dist')
