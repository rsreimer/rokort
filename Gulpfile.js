var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');


// VARIABLES ======================================================
var moduleName = 'rokort';

var outputFolder = 'build';

var globs = {
  sass: 'app/**/*.scss',
  templates: 'app/components/**/*.html',
  assets: 'app/assets/**/*.*',
  app: ['app/components/**/*.ts', 'app/app.ts'],
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
    'vendor/bootstrap/dist/css/bootstrap.css'
  ],
  js: [
  'vendor/angular/angular.js',
  'vendor/angular-animate/angular-animate.js',
  'vendor/ui-router/release/angular-ui-router.js'
  ]
};

var injectPaths = [
  destinations.libs + '/vendor-*.js',
  destinations.libs + '/vendor-*.css',
  destinations.js + "/**/*.js",
  destinations.js + "/templates-*.js",
  destinations.css + "/**/*.css"
];


var tsProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: true
});

var isProduction = process.argv[3] === '--prod';


// TASKS ===========================================================

function sass() {
  return gulp.src(globs.sass)
    .pipe($.sass({style: 'compressed', errLogToConsole: true}))
    .pipe($.autoprefixer())  // defauls to > 1%, last 2 versions, Firefox ESR, Opera 12.1
    .pipe(isProduction ? $.concat('app.css') : $.util.noop())
    .pipe($.rev())
    .pipe(gulp.dest(destinations.css))
    .pipe(browserSync.reload({stream: true}));
}

function tsLint() {
  return gulp.src(globs.app)
    .pipe($.tslint())
    .pipe($.tslint.report('prose', {emitError: true}));
}

function tsCompile() {
  var tsResult = gulp.src(globs.app)
    .pipe($.typescript(tsProject));

  return tsResult.js
    .pipe(isProduction ? $.concat('app.js') : $.util.noop())
    .pipe($.ngAnnotate({gulpWarnings: false}))
    .pipe(isProduction ? $.uglify() : $.util.noop())
    .pipe($.wrap('(function(){<%= contents %>}());'))
    .pipe($.rev())
    .pipe(gulp.dest(destinations.js))
    .pipe(browserSync.reload({stream: true}));
}

function templates() {
  return gulp.src(globs.templates)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({moduleName: moduleName, declareModule: false}))
    .pipe($.concat('templates.js'))
    .pipe(isProduction ? $.uglify() : $.util.noop())
    .pipe($.rev())
    .pipe(gulp.dest(destinations.js))
    .pipe(browserSync.reload({stream: true}));
}

function clean(cb) {
  del('build', cb);
}

function setupBrowserSync() {
  return browserSync({
    open: false,
    server: {
      baseDir: 'build'
    },
    watchOptions: {
      debounceDelay: 1000
    }
  });
}

function copyVendorJs() {
  var src = !isProduction ? libs.js :
    libs.js.map(function(file) {
      return file.replace('.js', '.min.js');
    });

  return gulp.src(src)
    .pipe(isProduction ? $.concat('vendor.js') : $.util.noop())
    .pipe($.rev())
    .pipe(gulp.dest(destinations.libs))
}

function copyVendorCss() {
  var src = !isProduction ? libs.css :
    libs.css.map(function(file) {
      return file.replace('.css', '.min.css');
    });

  return gulp.src(src)
    .pipe(isProduction ? $.concat('vendor.css') : $.util.noop())
    .pipe($.rev())
    .pipe(gulp.dest(destinations.libs))
}

function copyAssets() {
  return gulp.src(globs.assets)
    .pipe(gulp.dest(destinations.assets));
}

function copyManifest() {
  return gulp.src(globs.manifest)
    .pipe(gulp.dest(destinations.manifest));
}

function index() {
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
}

function watch() {
  gulp.watch(globs.sass, gulp.series(sass, index));
  gulp.watch(globs.app, gulp.series(tsLint, tsCompile, index));
  gulp.watch(globs.templates, gulp.series(templates, index));
  gulp.watch(globs.index, index);
  gulp.watch(globs.assets, copyAssets);
  gulp.watch(globs.manifest, copyManifest);
}

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(sass, copyAssets, copyManifest, tsCompile, templates, copyVendorCss, copyVendorJs),
    index
  ));

gulp.task('default', gulp.series('build', gulp.parallel(setupBrowserSync, watch)));