let plumber = require('gulp-plumber'),
gulpSass = require('gulp-sass'),
sass = require('sass'),
autoprefixer = require('gulp-autoprefixer'),
csso = require('gulp-csso'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename'),
scss = gulpSass(sass),
scssOptions = {
  silenceDeprecations: ['import', 'legacy-js-api', 'if-function']
},
stylesPATH = {
  "input": "./dev/static/styles/",
  "output": "./build/static/css/"
};

module.exports = function () {
  $.gulp.task('styles:dev', () => {
    return $.gulp.src(stylesPATH.input + 'styles.scss')
      .pipe(plumber({
        errorHandler: function(err) {
          console.log(err.message);
          this.emit('end');
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(scss(scssOptions))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 version']
      }))
      .pipe(sourcemaps.write())
      .pipe(rename('styles.min.css'))
      .pipe($.gulp.dest(stylesPATH.output))
      .on('end', $.browserSync.reload);
  });
  $.gulp.task('styles:build', () => {
    return $.gulp.src(stylesPATH.input + 'styles.scss')
      .pipe(scss(scssOptions))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 version']
      }))
      .pipe($.gulp.dest(stylesPATH.output))
  });
  $.gulp.task('styles:build-min', () => {
    return $.gulp.src(stylesPATH.input + 'styles.scss')
      .pipe(scss(scssOptions))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 version']
      }))
      .pipe(csso())
      .pipe(rename('styles.min.css'))
      .pipe($.gulp.dest(stylesPATH.output))
  });
};
