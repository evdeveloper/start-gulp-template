let esbuild = require('gulp-esbuild'),
    scriptsPATH = {
        "input": "./dev/static/js/",
        "output": "./build/static/js/"
    };

module.exports = function () {
    $.gulp.task('js:dev', () => {
        return $.gulp.src(scriptsPATH.input + 'main.js')
            .pipe(esbuild({
                outfile: 'main.min.js',
                bundle: true,
                minify: false,
                sourcemap: true,
                target: ['es2015']
            }))
            .pipe($.gulp.dest(scriptsPATH.output))
            .pipe($.browserSync.reload({
                stream: true
            }));
    });

    $.gulp.task('js:build', () => {
        return $.gulp.src(scriptsPATH.input + 'main.js')
            .pipe(esbuild({
                outfile: 'main.min.js',
                bundle: true,
                minify: false,
                sourcemap: true,
                target: ['es2015']
            }))
            .pipe($.gulp.dest(scriptsPATH.output))
    });

    $.gulp.task('js:build-min', () => {
        return $.gulp.src(scriptsPATH.input + 'main.js')
            .pipe(esbuild({
                outfile: 'main.min.js',
                bundle: true,
                minify: true,
                sourcemap: true,
                target: ['es2015']
            }))
            .pipe($.gulp.dest(scriptsPATH.output))
    });
};
