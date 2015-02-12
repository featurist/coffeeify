var pogo = require('pogo');
var fs = require('fs');
var through = require('through');
var convert = require('convert-source-map');
var checksum = require('checksum');
var mkdirp = require('mkdirp');
var cachePath = process.cwd() + "/.pogoCache/";

mkdirp.sync(cachePath)

function getCached(hash) {
  if (fs.existsSync(cachePath + hash)) {
    return fs.readFileSync(cachePath + hash, 'utf8');
  }
}

function writeCache(hash, contents){
  fs.writeFile(cachePath + hash, contents);
}

function compile(file, data) {
    var compiled = '';
    try {
        var fileContents = fs.readFileSync(file, 'utf8');
        var hash = checksum(fileContents);
        cached = getCached(hash);
        if (cached) {
            compiled = cached;
        }
        else {
            compiled = pogo.compile(fileContents);
            writeCache(hash, compiled);
        }
    }
    catch (e) {
        throw new Error("PogoScript compilation failed for '" + file + "'\n" + e.toString())
    }
    return compiled;
}

function isPogo (file) {
    return /\.pogo$/.test(file);
}

module.exports = function (file) {
    if (!isPogo(file)) return through();

    var data = '';
    return through(write, end);

    function write (buf) { data += buf }
    function end () {
        var src;
        try {
            src = compile(file, data);
        } catch (error) {
            this.emit('error', error);
        }
        this.queue(src);
        this.queue(null);
    }
};
