'use strict';

var gulp = require( 'gulp' );
// SASS
var sass = require( 'gulp-sass' );
var minifycss = require( 'gulp-clean-css' );
// JS
var babel = require( 'gulp-babel' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
// for Non Stop
var plumber = require( 'gulp-plumber' );
var notifier = require( 'node-notifier' );
// for webserver
var webserver = require( 'gulp-webserver' );

gulp.task( 'sass', function () {
    gulp.src( './css/scss/**/*.scss' )
        .pipe( plumber( {
            errorHandler: function ( error ) {
                console.log( error );
                this.emit( 'end' );
                notifier.notify( {
                    title: error.plugin,
                    message: JSON.stringify( error.loc ),
                    sound: true,
                    wait: true
                } );
            }
        } ) )
        .pipe( concat( 'application.scss' ) )
        .pipe( sass() )
        .pipe( gulp.dest( './css' ) );
} );

gulp.task( 'js', function () {
    return gulp.src( './js/src/*.js' )
        .pipe( plumber( {
            errorHandler: function ( error ) {
                console.log( error );
                this.emit( 'end' );
                notifier.notify( {
                    title: error.plugin,
                    message: JSON.stringify( error.loc ),
                    sound: true,
                    wait: true
                } );
            }
        } ) )
        .pipe( babel( {
            presets: [ 'es2015' ]
        } ) )
        .pipe( concat( 'application.js' ) )
        .pipe( gulp.dest( './js' ) );
} );

gulp.task( 'watch', function () {
    gulp.watch( './css/sass/**/*.scss', [ 'sass' ] );
    gulp.watch( './js/src/**/*.js', [ 'js' ] );
} );

gulp.task( 'webserver', function () {
    gulp.src( './' )
        .pipe( webserver( {
            livereload: true
        } ) );
} );

gulp.task( 'lib-css', function () {
    return gulp.src( [] )
        .pipe( concat( 'lib.min.css' ) )
        .pipe( minifycss() )
        .pipe( gulp.dest( './css/' ) );
} );

gulp.task( 'lib-font', function () {
    return gulp.src( [] )
        .pipe( gulp.dest( './font/' ) );
} );

gulp.task( 'lib-js', function () {
    return gulp.src( [] )
        .pipe( concat( 'lib.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( './js/' ) );
} );

gulp.task( 'default', [ 'sass', 'js', 'lib-css', 'lib-font', 'lib-js', 'webserver', 'watch' ] );