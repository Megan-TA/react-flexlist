var path = require('path')
var gulp = require('gulp')
var plumber = require('gulp-plumber')
var babel = require('gulp-babel')
var del = require('del')
var uglify = require('gulp-uglify')
var pump = require('pump')

var dest = 'publish'

gulp.task('copy', ['clean:publish'], () => {
	return gulp
			.src([
				'./!(node_modules|mock|test|!(index).js)/*',
				'./!(node_modules|mock|test|!(index).js)'
			])
			.pipe(plumber())
			.pipe(gulp.dest(dest))
})

gulp.task('handleJS', ['copy'], (cb) => {
	pump([
		gulp.src([
			'publish/*.js',
			'publish/**/*.js'
		]),
		babel(),
		gulp.dest(dest)
	], cb)
})

gulp.task('compress', ['handleJS'], (cb) => {
	pump([
		gulp.src([
			'publish/*.js',
			'publish/**/*.js'
		]),
		uglify({
			compress: {
				drop_console: true
			}
		}),
		gulp.dest(dest)
	], cb)
})

gulp.task('watch', () => {
	return gulp
		.watch([
			'./test/src/*.jsx'
		], ['_test'])
		.on('change', function(event) {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
		})
		.on('error', function(error) {
			console.error(error)
		})

})

gulp.task('_test', () => {
	return gulp
			.src('./test/src/*.jsx')
			.pipe(babel())
			.pipe(plumber())
			.pipe(gulp.dest('./test/dist/'))
})

gulp.task('clean:publish', () => {
	return del([
		'publish'
	])
})

gulp.task('default', ['compress'])

gulp.task('test', ['_test', 'watch'])