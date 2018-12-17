
const gulp = require("gulp"),
sass = require('gulp-sass'),
browserSync = require('browser-sync').create(), 
cleanDir = require('gulp-clean'),
clean_css = require('gulp-clean-css'),
concat = require('gulp-concat'),
concat_css = require('gulp-concat-css'),
sourcemaps = require('gulp-sourcemaps'),
uglify = require("gulp-uglify"),
notify = require("gulp-notify"),
plumber = require("gulp-plumber"),
changed = require("gulp-changed"),
postcss = require("gulp-postcss"),
autoprefixer = require('autoprefixer'),
css_mqpacker = require("css-mqpacker"),
sortCSSmq = require('sort-css-media-queries'),
postcss_import = require("postcss-import"),
babel = require("gulp-babel"),
sassLint = require('gulp-sass-lint'),
eslint = require('gulp-eslint'),
htmlhint = require('gulp-htmlhint');



//=============================All==================================
//настройки browser-sync
var config = {
    server: {
        baseDir: "./public"
    }
};

//плагины postcss
var postcss_plugins = [
    autoprefixer({ browsers: ['> 2%', 'IE >= 11','Chrome >= 50','Firefox >= 25'] }),
    css_mqpacker({ sort: sortCSSmq }),
    postcss_import()
];


//очищаю assets
gulp.task('clean-assets', function () {
    return gulp.src('public/assets/*', { read: false })
        .pipe(cleanDir());
});




//======================Dev=========================================

//работаю с css 
gulp.task('css-dev', function () {
    return gulp.src('resources/sass/*.scss')
        .pipe(changed('public/assets/css/', { hasChanged: changed.compareContents }))
        .pipe(plumber())
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', notify.onError({ message: "<%= error.message %>", title: "Ошибка Sass" })))
        .pipe(postcss(postcss_plugins))
        .pipe(sourcemaps.write())
        .pipe(concat_css("bundle.css"))
        .pipe(gulp.dest('public/assets/css/'))
        .pipe(browserSync.stream());
});


//работаю с js
gulp.task('js-dev', function () {
    return gulp.src('resources/js/*.js')
        .pipe(changed('public/assets/js/', { hasChanged: changed.compareContents }))
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('public/assets/js/'))
});

//работаю с html 
gulp.task('html-lint-dev', function () {
    return gulp.src("public/*.html")
        .pipe(plumber())
        .pipe(htmlhint())
        .pipe(htmlhint.failAfterError())
})

//Вспомогательная функция которая обновляет страницу
gulp.task('reload-page',function(){
    browserSync.reload();
})

//Отслеживаю изменения
gulp.task('watch',function(){
    browserSync.init(config);
    gulp.watch('resources/sass/**/*.scss', gulp.series('css-dev'));
    gulp.watch('resources/js/**/*.js').on("change", gulp.series('js-dev', 'reload-page'));
    gulp.watch('public/*.html').on("change", gulp.series('html-lint-dev', 'reload-page'));

})
//====================================================================




//======================Build=========================================
//работаю с css 
gulp.task('css-build', function () {
    return gulp.src('resources/sass/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sass().on('error', notify.onError({ message: "<%= error.message %>", title: "Ошибка Sass" })))
        .pipe(postcss(postcss_plugins))
        .pipe(concat_css("bundle.css"))
        .pipe(clean_css())
        .pipe(gulp.dest('public/assets/css/'));
});

//работаю с js
gulp.task('js-build', function () {
    return gulp.src('resources/js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js/'));
});


//работаю с html 
gulp.task('html-lint-build', function () {
    return gulp.src("public/*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.failAfterError())
})
//====================================================================


gulp.task('develop', gulp.series('clean-assets', gulp.parallel('css-dev', 'js-dev', 'html-lint-dev', 'watch')));
gulp.task('build', gulp.series('clean-assets', gulp.parallel('css-build', 'js-build', 'html-lint-build')));