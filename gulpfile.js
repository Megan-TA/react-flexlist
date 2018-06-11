var path = require('path')
var gulp = require('gulp')
var plumber = require('gulp-plumber')
var babel = require('gulp-babel')

var dest = './publish'

gulp.task('copy', () => {
	return gulp
		.src([
			'./!(node_modules|publish)/**/*',
			'./!(node_modules|publish)',
			'./.!(git)*',
			'./!*.js'
		])
		.pipe(plumber())
		.pipe(gulp.dest(dest))
})

gulp.task('babel', ['copy'], () => {
	return gulp
		.src([
			'./!(node_modules|publish)/**/*.js',
			'./*.js'
		])
		.pipe(babel())
		.pipe(plumber())
		.pipe(gulp.dest(dest))
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

gulp.task('default', ['babel'])

gulp.task('test', ['_test', 'watch'])