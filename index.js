var gulp = require('gulp'),
    file = require('gulp-file'),
    filenames = require('gulp-filenames'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    beautify = require('gulp-jsbeautify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    path = require('path'),
    exists = require('path-exists').sync,
    sequence = require('run-sequence'),
    config = Elixir.config;

Elixir.extend('bowerJs', function(outputDir, options) {
    // Options were provided on the outputDir parameter
    if (typeof outputDir == 'object') {
        options = outputDir;
        outputDir = null;
    }

    options = typeof options == 'undefined' ? {camelCase: false} : options;

    var paths = new Elixir.GulpPaths()
        .output(outputDir || config.get('assets.js.folder') + '/vendor');

    new Elixir.Task('bowerJs', function () {
        var bower_components = require('bower-files')(options);
        var getMinifiedScripts = function (path, index, arr) {
                var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
                return exists( newPath ) ? newPath : path;
            },
            isNotMinified = function(file) {
                var filename = file.history[file.history.length - 1];
                return !(/\.min\.js$/.test(filename));
            },
            jsfiles = bower_components.ext('js').deps,
            tasks = [],
            createFolder;

        for (var packageName in jsfiles) {
            if (jsfiles[packageName].length) {
                jsfiles[packageName].map(getMinifiedScripts);

                createFolder = jsfiles[packageName].length > 1;

                tasks.push(
                    gulp.src(jsfiles[packageName])
                        .pipe(gulpif(isNotMinified, uglify()))
                        .pipe(gulpif(createFolder, rename({dirname: packageName.replace(/\.js$/, '')})))
                        .pipe(gulpif(!createFolder, rename({basename: packageName.replace(/\.js$/, '')})))
                        .pipe(filenames(packageName.replace(/\.js$/, '')))
                        .pipe(gulp.dest(paths.output.path))
                );
            }
        }

        return merge.apply(this, tasks);
    });
});

Elixir.extend('bowerMain', function(filename, shim, outputDir) {
    var paths = new Elixir.GulpPaths()
        .output(outputDir || config.get('assets.js.folder') + '/vendor');

    new Elixir.Task('bowerMain', function() {
        var main = {paths: {}, baseUrl: 'js', shim: (shim || {})};
        var files = filenames.get("all"),
            packages = [];

        for (var packageName in files) {
            packages.push(packageName);
        }

        packages = packages.sort()

        for (var i in packages) {
            main.paths[packages[i]] = 'vendor/' + packages[i];
        }

        var main_str = 'require.config(' + JSON.stringify(main) + ');';

        return file(filename, main_str)
            .pipe(beautify({indentSize: 4}))
            .pipe(gulp.dest(paths.output.path));
    });

});

Elixir.extend('bowerFonts', function(outputDir, options) {
    // Options were provided on the outputDir parameter
    if (typeof outputDir == 'object') {
        options = outputDir;
        outputDir = null;
    }

    options = typeof options == 'undefined' ? {camelCase: false} : options;

    var paths = new Elixir.GulpPaths()
        .output(outputDir || config.publicPath + '/fonts');

    new Elixir.Task('bowerFonts', function() {
        var bower_components = require('bower-files')(options);
        var fonts = bower_components.ext(['eot', 'woff', 'woff2', 'ttf', 'svg']).deps,
            tasks = [];

        for (var packageName in fonts) {
            if (fonts[packageName].length) {
                tasks.push(
                    gulp.src(fonts[packageName])
                        .pipe(gulp.dest(paths.output.path + '/' + packageName))
                );
            }
        }

        return merge.apply(this, tasks);
    });

});

Elixir.extend('bowerImages', function(outputDir, options) {
    // Options were provided on the outputDir parameter
    if (typeof outputDir == 'object') {
        options = outputDir;
        outputDir = null;
    }

    options = typeof options == 'undefined' ? {camelCase: false} : options;

    var paths = new Elixir.GulpPaths()
        .output(outputDir || config.publicPath + '/img/vendor');

    new Elixir.Task('bowerImages', function() {
        var bower_components = require('bower-files')(options);
        var images = bower_components.ext(['png', 'jpg', 'gif', 'jpeg']).deps,
            tasks = [];

        for (var packageName in images) {
            if (images[packageName].length) {
                tasks.push(
                    gulp.src(images[packageName])
                        .pipe(imagemin())
                        .pipe(gulp.dest(paths.output.path + '/'  + packageName))
                );
            }
        }

        return merge.apply(this, tasks);
    });

});