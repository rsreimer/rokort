var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');


// VARIABLES ======================================================
var moduleName = 'rokort';
var isDist = $.util.env.type === 'dist';
var outputFolder = 'build';

var globs = {
  sass: 'app/**/*.scss',
  templates: 'app/components/**/*.html',
  assets: 'app/assets/**/*.*',
  app: ['app/**/*.ts', '!app/types'],
  index: 'app/index.html',
  manifest: 'app/manifest.json'
};

var destinations = {
  css: outputFolder + "/style",
  js: outputFolder + "/src",
  libs: outputFolder + "/vendor",
  assets: outputFolder + "/assets",
  index: outputFolder,
  manifest: outputFolder
};

var libs = {
  css: [
    'vendor/bootstrap/dist/css/bootstrap.min.css'
  ],
  js: [
  'vendor/angular/angular.min.js',
  'vendor/angular-animate/angular-animate.min.js',
  'vendor/ui-router/release/angular-ui-router.min.js'
  ]
};

var injectPaths = [
  destinations.libs + '/vendor.js',
  destinations.libs + '/vendor.css',
  destinations.js + "/**/*.js",
  destinations.js + "/templates.js",
  destinations.css + "/**/*.css"
];

var tsProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: true
});

// TASKS ===========================================================

gulp.task('sass', function () {
  return gulp.src(globs.sass)
    .pipe($.sass({style: 'compressed', errLogToConsole: true}))
    .pipe($.autoprefixer())  // defauls to > 1%, last 2 versions, Firefox ESR, Opera 12.1
    .pipe(isDist ? $.concat('app.css') : $.util.noop())
    .pipe(gulp.dest(destinations.css))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('ts-lint', function () {
  return gulp.src(globs.app)
    .pipe($.tslint())
    .pipe($.tslint.report('prose', {emitError: true}));
});

gulp.task('ts-compile', function () {
  var tsResult = gulp.src(globs.app)
    .pipe($.typescript(tsProject));

  return tsResult.js
    .pipe(isDist ? $.concat('app.js') : $.util.noop())
    .pipe($.ngAnnotate({gulpWarnings: false}))
    .pipe(isDist ? $.uglify() : $.util.noop())
    .pipe($.wrap('(function(){<%= contents %>}());'))
    .pipe(gulp.dest(destinations.js))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('templates', function () {
  return gulp.src(globs.templates)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({moduleName: moduleName, declareModule: false}))
    .pipe($.concat('templates.js'))
    .pipe(isDist ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(destinations.js))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function (cb) {
  del('build', cb);
});

gulp.task('browser-sync', function () {
  return browserSync({
    open: false,
    server: {
      baseDir: "./build"
    },
    watchOptions: {
      debounceDelay: 1000
    }
  });
});

gulp.task('copy-vendor-js', function () {
  return gulp.src(libs.js)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(destinations.libs))
});

gulp.task('copy-vendor-css', function () {
  return gulp.src(libs.css)
    .pipe($.concat('vendor.css'))
    .pipe(gulp.dest(destinations.libs))
});

gulp.task('copy-assets', function () {
  return gulp.src(globs.assets)
    .pipe(gulp.dest(destinations.assets));
});

gulp.task('copy-manifest', function () {
  return gulp.src(globs.manifest)
    .pipe(gulp.dest(destinations.manifest));
});

gulp.task('index', function () {
  return gulp.src(globs.index)
    .pipe($.inject(gulp.src(injectPaths, {read: false}), {
        ignorePath: outputFolder,
        addRootSlash: false
      }))
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(destinations.index));
});

gulp.task('watch', function() {
  gulp.watch(globs.sass, 'sass');
  gulp.watch(globs.app, gulp.series('ts-lint', 'ts-compile'));
  gulp.watch(globs.templates, 'templates');
  gulp.watch(globs.index, 'index');
  gulp.watch(globs.assets, 'copy-assets');
  gulp.watch(globs.manifest, 'copy-manifest');
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('sass', 'copy-assets', 'copy-manifest', 'ts-compile', 'templates', 'copy-vendor-css', 'copy-vendor-js'),
    'index'
  )
);

gulp.task(
  'default',
  gulp.series('build', gulp.parallel('browser-sync', 'watch'))
);
