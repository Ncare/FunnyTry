var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify")

gulp.task("default", function () {
    return gulp.src("src/**/*.js")// ES6 源码存放的路径
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-object-assign'] 
        }))
        .pipe(gulp.dest("dist")); //转换成 ES5 存放的路径
});