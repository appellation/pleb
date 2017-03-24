const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

gulp.task('default', ['css']);
gulp.watch('site/src/**/*', ['css']);

gulp.task('css', () => {
    gulp.src('site/src/styles/**')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest('site/bin'));
});