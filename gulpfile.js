const path = require('path');
const browserify = require('browserify');
const through = require('through2');

const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const globby = require('globby');
const cleanCSS = require('gulp-clean-css');
const gutil = require('gulp-util');

gulp.task('default', ['css']);
gulp.watch('site/src/styles/**/*', ['css']);
gulp.watch('site/src/scripts/**/*', ['js']);

gulp.task('css', () => {
    return gulp.src('site/src/styles/main.sass')
        .pipe(sass({ includePaths: [
            path.join(process.cwd(), 'node_modules')
        ]}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('site/bin'));
});

gulp.task('js', () => {
    const bundledStream = through();

    bundledStream
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join('site/bin/')));

    globby([path.join('site', 'src', 'scripts', '*.js')]).then(entries => {
        const b = browserify({
            entries,
            debug: true,
            transform: ['babelify']
        });

        b.bundle().pipe(bundledStream);
    }).catch(e => {
        bundledStream.emit('error', e);
    });

    return bundledStream;
});