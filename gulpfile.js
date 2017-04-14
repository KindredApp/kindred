const gulp = require('gulp');
const exec = require('gulp-exec');
const run = require('gulp-run');

let server = null;

gulp.task('redisStart', function() {
  return run('redis-server').exec();
});

gulp.task('serverStart', function() {
  server = 'npm start';
  return run('npm start').exec();
});

gulp.task('webpackStart', function() {
  return run('npm run build:watch').exec();
});

gulp.task('postgresInit', function() {
  return run('psql postgres;').exec();
});

gulp.task('postgresConnect', function() {
  return run('\\connect kindred;').exec();
});

gulp.task('postgresDrop', function() {
  return run('DROP DATABASE kindred;').exec();
});

gulp.task('postgresCreate', function() {
  return run('CREATE DATABASE kindred;').exec();
});

gulp.task('redisStop', function(done) {
  return run('redis-cli shutdown').exec();
  done();
});

//
gulp.task('serverStop', function(done) {
  return run('').exec();
  done();
});

gulp.task('serverStop', function() {
 // Stop the server
 if (server && server !== 'null') {
  server.kill();
 }});


gulp.task('build', gulp.series('webpackStart', 'serverStart', 'redisStart'));
gulp.task('stop', gulp.series('redisStop', 'serverStop'));
// gulp.task('start', (argv.clean ? gulp.series(stop, build) : gulp.series(build)));
