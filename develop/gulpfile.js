var gulp       = require('gulp');
var ts         = require('gulp-typescript');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var supervisor = require( "gulp-supervisor" );
var fs         = require("fs");
var run = require('gulp-run');

function deleteall(path) {  
    var files = [];  
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path);  
        files.forEach(function(file, index) {  
            var curPath = path + "/" + file;  
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }  
        });  
        fs.rmdirSync(path);  
    }  
};  

var des_root_dir = "../distribute/";
var ts_config = {
            noImplicitAny: false,
            target:"ES2017",
            noEmitHelpers:true
        }

function clear_output(){
    deleteall(des_root_dir + "app")
    deleteall(des_root_dir + "test")
}


gulp.task('release', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts(ts_config));

    return tsResult
        .pipe(uglify())
        // .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest(des_root_dir));

});

gulp.task('debug', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts(ts_config));

    return tsResult
        // .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest(des_root_dir));

});


gulp.task('distribute', function() {
    clear_output();
    gulp.src('src/**/*.ts')
        .pipe(ts(ts_config))
        .pipe(uglify())
        // .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest(des_root_dir));

    gulp.watch('src/**/*.ts', ['release']);
});

gulp.task( "dev_run", function() {
    // clear_output();
    gulp.watch('src/**/*.ts', ['debug'])
    gulp.src('src/**/*.ts')
        .pipe(ts(ts_config))
        // .pipe(uglify())
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest(des_root_dir))
        .pipe(run('npm run --prefix ../distribute dev'))
} );
