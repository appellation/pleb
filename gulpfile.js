const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

gulp.task('default', ['css']);
gulp.watch('site/src/**/*', ['css']);

gulp.task('css', () => {
    gulp.src('site/src/styles/main.sass')
        .pipe(sass({ includePaths: [
            path.join(process.cwd(), 'node_modules')
        ]}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('site/bin'));
});