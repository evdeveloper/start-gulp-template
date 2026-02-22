let through = require('through2'),
sharp = require('sharp'),
path = require('path'),
imgPATH = {
  "input": ["./dev/static/images/**/*.{png,jpg,jpeg,gif,webp}",
      '!./dev/static/images/svg/*'],
  "output": "./build/static/images/"
};

function optimizeImages() {
  return through.obj(async function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new Error('Streams are not supported'));
    }

    const ext = path.extname(file.path).toLowerCase();

    try {
      let optimized;

      if (ext === '.jpg' || ext === '.jpeg') {
        optimized = await sharp(file.contents)
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      } else if (ext === '.png') {
        optimized = await sharp(file.contents)
          .png({ quality: 80, compressionLevel: 8 })
          .toBuffer();
      } else if (ext === '.webp') {
        optimized = await sharp(file.contents)
          .webp({ quality: 80 })
          .toBuffer();
      } else if (ext === '.gif') {
        // Sharp has limited GIF support, pass through
        optimized = file.contents;
      } else {
        optimized = file.contents;
      }

      file.contents = optimized;
      cb(null, file);
    } catch (err) {
      console.log('Image optimization error:', file.path, err.message);
      cb(null, file); // Pass through on error
    }
  });
}

module.exports = function () {
  $.gulp.task('img:dev', () => {
    return $.gulp.src(imgPATH.input)
      .pipe($.gulp.dest(imgPATH.output));
  });

  $.gulp.task('img:build', () => {
    return $.gulp.src(imgPATH.input)
      .pipe(optimizeImages())
      .pipe($.gulp.dest(imgPATH.output));
  });
};
