# pogoify

browserify v2 plugin for PogoScript

mix and match `.pogo` and `.js` files in the same project

**important: when using require('path/to/file.pogo') remember to use .pogo extension**

[![build status](https://secure.travis-ci.org/featurist/pogoify.png)](http://travis-ci.org/featurist/pogoify)

# example

given some files written in a mix of `js` and `pogo`:

foo.pogo:

``` pogo
console.log(require './bar.js')
```

bar.js:

``` js
module.exports = require('./baz.pogo')(5)
```

baz.pogo:

``` js
module.exports (n) = n * 111
```

install pogoify into your app:

```
$ npm install pogoify
```

when you compile your app, just pass `-t pogoify` to browserify:

```
$ browserify -t pogoify foo.pogo > bundle.js
$ node bundle.js
555
```

## Express

    npm install browserify-middleware
    
Then, in app.js:

    var browserify = require('browserify-middleware');
    
    ...
    
    app.get('app.js', browserify('./client/app.js', {transform: ['pogoify']}));

# install

With [npm](https://npmjs.org) do:

```
npm install pogoify
```

# license

MIT
