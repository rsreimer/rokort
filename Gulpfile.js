var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');


// VARIABLES ======================================================
var moduleName = 'rokort';

var isProduction = process.argv[3] === '--prod';

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
  fonts: outputFolder + "/fonts",
  vendor: outputFolder + "/vendor",
  assets: outputFolder + "/assets",
  index: outputFolder,
  manifest: outputFolder
};

var libs = {
  css: [
    'vendor/bootstrap/dist/css/bootstrap.css',
    'vendor/angular-ui-select/dist/select.css'
  ],
  js: [
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-sanitize/angular-sanitize.js',
    'vendor/ui-router/release/angular-ui-router.js',
    'vendor/angular-ui-select/dist/select.js'
  ],
  fonts: [
    'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
    'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
    'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
    'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
    'vendor/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
  ]
};

var injectPaths = [];

if (isProduction) {
  libs.js = libs.js.map(function(file) {
    return file.replace('.js', '.min.js');
  });

  libs.css = libs.css.map(function(file) {
    return file.replace('.css', '.min.css');
  });

  injectPaths = injectPaths.concat([
    destinations.vendor + "/vendor-*.js",
    destinations.vendor + "/vendor-*.css"
  ]);
} else {
  var src = libs.css.concat(libs.js);
  injectPaths = injectPaths.concat(src.map(function (file) {
    return destinations.vendor + '/' + file.split('/').pop();
  }));
}

injectPaths = injectPaths.concat([
  destinations.js + "/**/*.js",
  destinations.js + "/templates*.js",
  destinations.css + "/**/*.css"
]);

var tsProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: true
});

// TASKS ===========================================================

function sass() {
  return gulp.src(globs.sass)
    .pipe($.sass({style: 'compressed', errLogToConsole: true}))
    .pipe($.autoprefixer())  // defauls to > 1%, last 2 versions, Firefox ESR, Opera 12.1
    .pipe(isProduction ? $.concat('app.css') : $.util.noop())
    .pipe(isProduction ? $.rev() : $.util.noop())
    .pipe(gulp.dest(destinations.css))
}

function tsLint() {
  return gulp.src(globs.app)
    .pipe($.tslint())
    .pipe($.tslint.report('prose'));
}

function tsCompile() {
  var tsResult = gulp.src(globs.app)
    .pipe($.typescript(tsProject));

  return tsResult.js
    .pipe(isProduction ? $.concat('app.js') : $.util.noop())
    .pipe($.ngAnnotate({gulpWarnings: false}))
    .pipe(isProduction ? $.uglify() : $.util.noop())
    .pipe($.wrap('(function(){<%= contents %>}());'))
    .pipe(isProduction ? $.rev() : $.util.noop())
    .pipe(gulp.dest(destinations.js));
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
    .pipe(isProduction ? $.rev() : $.util.noop())
    .pipe(gulp.dest(destinations.js));
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
  return gulp.src(libs.js)
    .pipe(isProduction ? $.concat('vendor.js') : $.util.noop())
    .pipe(isProduction ? $.rev() : $.util.noop())
    .pipe(gulp.dest(destinations.vendor))
}

function copyVendorCss() {
  return gulp.src(libs.css)
    .pipe(isProduction ? $.concat('vendor.css') : $.util.noop())
    .pipe(isProduction ? $.rev() : $.util.noop())
    .pipe(gulp.dest(destinations.vendor))
}

function copyVendorFonts() {
  return gulp.src(libs.fonts)
    .pipe(gulp.dest(destinations.fonts))
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
    .pipe(gulp.dest(destinations.index))
    .pipe(browserSync.reload({stream: true}));
}

function watch() {
  gulp.watch(globs.sass, gulp.series(sass, index));
  gulp.watch(globs.app, gulp.series(tsCompile, index));
  gulp.watch(globs.templates, gulp.series(templates, index));
  gulp.watch(globs.index, index);
  gulp.watch(globs.assets, copyAssets);
  gulp.watch(globs.manifest, copyManifest);
}

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(sass, copyAssets, copyManifest, tsLint, tsCompile, templates, copyVendorCss, copyVendorJs, copyVendorFonts),
    index
  ));

gulp.task('default', gulp.series('build', gulp.parallel(setupBrowserSync, watch)));