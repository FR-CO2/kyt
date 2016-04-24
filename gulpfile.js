var gulp = require('gulp'),
        watch = require('gulp-watch'),
        runSequence = require('run-sequence'),
        fs = require('fs'),
        browserify = require("browserify"),
        babelify = require("babelify"),
        uglify = require("gulp-uglify"),
        source = require('vinyl-source-stream');


gulp.task('browserify', function () {
    return browserify({debug: true})
            .transform(babelify)
            .require("./src/main/resources/public/scripts/app/app.js", {entry: true})
            .bundle()
            .on("error", function (err) {
                console.log("Error: " + err.message);
            })
            .pipe(fs.createWriteStream("./src/main/resources/public/scripts/bundle.js"));
});

gulp.task("minify", function () {
    return gulp.src("./src/main/resources/public/scripts/bundle.js")
            .pipe(uglify())
            .pipe(gulp.dest("./src/main/resources/public/scripts"));
});

gulp.task("watch", function () {
    // Watch our scripts
    gulp.watch(["./src/main/resources/public/script/**.js"], [
        "browserify"
    ]);

});

gulp.task('default', function () {
    return runSequence("browserify", "minify");
});
