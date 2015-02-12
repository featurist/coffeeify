var test = require('tap').test;
var browserify = require('browserify');
var vm = require('vm');
var fs = require('fs-extra');
var checksum = require('checksum');
var pogo = require('pogo');

var cachePath = __dirname+'/.pogoCache/';

function bundle (file) {
    test('bundle transform', function (t) {
        t.plan(2);
        var filePath = __dirname + file;
        fs.remove(cachePath, function(){
          var b = browserify();
          b.add(filePath);
          b.transform(__dirname + '/..');
          b.bundle(function (err, src) {
              if (err) t.fail(err);
              vm.runInNewContext(src, {
                  console: { log: log }
              });
              t.test('caches input by hash', function(t){
                t.plan(3);
                var fileContents = fs.readFileSync(filePath, 'utf8');
                var hash = checksum(fileContents);
                var cachedFile = cachePath+hash;
                t.ok(fs.existsSync(cachedFile), 'a compiled version of the file should be cached');
                t.equal(fs.readFileSync(cachedFile, 'utf8'), pogo.compile(fileContents), 'cached file should be the compiled source');

                t.test('uses cached file the next time it is requested', function(t){
                  t.plan(1);
                  var fakeCache = 'console.log("this is a cached file with fake content");';
                  fs.writeFileSync(cachedFile, fakeCache);

                  var b = browserify();
                  b.add(filePath);
                  b.transform(__dirname + '/..');
                  b.bundle(function (err, src) {
                    t.ok(src.indexOf(fakeCache) != -1, 'file should have been read from the cache');
                  });
                });
              });
          });

          function log (msg) {
              t.equal(msg, 555);
          }
        });
    });

}

bundle('/../example/foo.pogo');
