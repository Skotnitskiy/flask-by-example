var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence').use(gulp);
var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');
var gulpIf = require('gulp-if');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('scss/*.scss', ['sass'], browserSync.reload);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    // gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        }
    })
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    var processors = [
        autoprefixer({browsers: ['last 2 version']}),
        cssnano()
    ];
    return gulp.src("scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

gulp.task('useref', function(){
    return gulp.src('*.html')
        .pipe(useref())
        /*
        .pipe(gulpIf('*.js', uglify()))
        */
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest(''))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

gulp.task('build', function (callback) {
    runSequence(
        ['sass', 'useref'/*, 'images', 'fonts'*/],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
});