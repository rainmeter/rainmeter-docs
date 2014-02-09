// Based on:
//   hexo-generator-minify, Copyright (c) 2013 Chris Yip
//   hexo-gzip, Copyright (c) Vincent Rabah

var uglify = require('uglify-js'),
    cssc = require('css-condense'),
    async = require('async');

var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    zlib = require('zlib');

var supportedResources = {
    'js': function (content, opts) {
        return uglify.minify(content, {
            fromString: true
        }).code
    },
    'css': function (content, opts) {
        var csscOpts = opts.cssSafe ? {
            consolidateViaDeclarations: false,
            consolidateMediaQueries: false,
            consolidateViaSelectors: false,
            sortSelectors: false,
            lineBreaks: true
        } : {};
        return cssc.compress(content, csscOpts);
    }
};

/**
 * Navigate a folder recursively and optimize resources
 * @param item where to start the navigation from
 */
var optimize = function (item, opts) {
    fs.readdir(item, function (err, files) {
        if (!files) return;

        files.forEach(function (file) {
            var target = path.join(item, file);
            var stats = fs.statSync(target);

            if (stats.isDirectory()) {
                optimize(target, opts);
            } else if (stats.isFile()) {
                compress(target, opts);
            }
        });
    });
};

/**
 * Util to ignore files that are already minified
 * @param filename file to be tested
 * @returns {boolean} true if already minified, false elsewhere
 */
var alreadyPacked = function (filename) {
    return (filename.indexOf(".min") > 0 ||
        filename.indexOf(".pack") > 0);
};

/**
 * Util to check if we have a minification strategy for given file extension
 * @param fileExt file extension to be tested
 * @returns {boolean} true if we are able to minify given extension, false elsewhere
 */
var processable = function (fileExt) {
    return (Object.keys(supportedResources)
        .indexOf(fileExt) > -1);
};

/**
 * Perform file content minification overwriting the original content
 * @param filename pathname of the file to be minified
 */
var compress = function (filename, opts) {
    var fileExt = path.extname(filename || '').replace(".", "");

    if (alreadyPacked(filename) || !processable(fileExt)) {
        if (filename.match(/\.html$/)) {
            var input = fs.createReadStream(filename);
            var output = fs.createWriteStream(filename + '.gz');
            input.pipe(zlib.createGzip()).pipe(output);
        }
        return;
    }

    var originalContent = fs.readFileSync(filename).toString();
    var minifiedContent = supportedResources[fileExt](originalContent, opts);

    if (minifiedContent) {
        fs.unlink(filename, function (err) {
            if (err) throw err;
            fs.writeFile(filename, minifiedContent, 'utf8', function (err) {
                if (err) throw err;
            })
        });

        zlib.gzip(minifiedContent, function (err, result) {
            if (err) throw err;
            fs.writeFile(filename + '.gz', result, function (err) {
                if (err) throw err;
            });
        });
    }
};

hexo.extend.console.register('generate_optimize', 'Generate gzipped and minified resources', function (args) {
    async.series([
        function (next) {
            hexo.call("generate", next)
        },
        function () {
            if (fs.existsSync(hexo.public_dir)) {
                optimize(hexo.public_dir, args);
            } else {
                throw new Error(hexo.public_dir + " NOT found.")
            }
        }
    ], function (err) {
        if (err) {
            util.error("[error] Optimize: -> " + err.message);
        }
    });
});