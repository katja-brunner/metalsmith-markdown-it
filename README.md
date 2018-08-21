# metalsmith-markdown-it-easy

A __[Metalsmith](https://github.com/segmentio/metalsmith)__ plugin to convert markdown files using __[markdown-it](https://github.com/markdown-it/markdown-it/)__, an easy extendable Node.js module for multimarkdown features.

Inspired by [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) by segment.io.


## Install

```bash
npm install metalsmith-markdown-it-easy
```


## Javascript Usage

### Simple without options

Pass the metalsmith-markdown-it-easy plugin to [Metalsmith](https://github.com/segmentio/metalsmith) with the `use` method:

```js
var metalsmith = require('metalsmith');
var markdownIt = require('metalsmith-markdown-it-easy');

metalsmith.use(markdownIt());
```

### With options

Pass `options` to the metalsmith-markdown-it-easy plugin as you would pass them to [markdown-it](https://github.com/markdown-it/markdown-it/). Then pass the metalsmith-markdown-it-easy plugin to [Metalsmith](https://github.com/segmentio/metalsmith) with the `use` method:

```js
var metalsmith = require('metalsmith');
var markdownIt = require('metalsmith-markdown-it-easy');

metalsmith.use(markdownIt({
    html: true,
    linkify: true
}));
```

Please refer to [markdown-it](https://github.com/markdown-it/markdown-it/) for supported options.


### With options and markdown-it plugins/extensions

Pass `options` to the metalsmith-markdown-it-easy plugin as you would pass them to [markdown-it](https://github.com/markdown-it/markdown-it/). 

Add another key `plugins` to the `options`. Require the [markdown-it plugins](https://www.npmjs.com/browse/keyword/markdown-it-plugin) you want to use and push them to the `plugins` `Array`. If you have `options` for a plugin, add this plugin followed by its `options` to another `Array` as you would pass them to the original [markdown-it plugin](https://www.npmjs.com/browse/keyword/markdown-it-plugin). 

Then pass the metalsmith-markdown-it-easy plugin to [Metalsmith](https://github.com/segmentio/metalsmith) with the `use` method:

```js
var metalsmith = require('metalsmith');
var markdownIt = require('metalsmith-markdown-it-easy');
var markdownItPlugin = require('some markdown-it plugin');
var markdownItPluginWithOptions = require('some markdown-it plugin with options');

metalsmith.use(markdownIt({
    html: true,
    linkify: true,
    plugins: [
        markdownItPlugin, 
        [markdownItPluginWithOptions, 'option1', option2, {option3: 'options3 value'}]
    ]
}));
```

Please refer to [markdown-it](https://github.com/markdown-it/markdown-it/) for supported options.

Please refer to [markdown-it-plugins list](https://www.npmjs.com/browse/keyword/markdown-it-plugin) for supported plugins and their options.

### Overwrite renderer rules

Pass `options` to the metalsmith-markdown-it-easy plugin as you would pass them to [markdown-it](https://github.com/markdown-it/markdown-it/). 

Add another key `renderer` to the `options`. Add the key `rules` and to that the rule you want to overwrite, e.g. `image` with your renderer function as value, e.g. `fooImageRenderer`.

Then pass the metalsmith-markdown-it-easy plugin to [Metalsmith](https://github.com/segmentio/metalsmith) with the `use` method:

```js
var metalsmith = require('metalsmith');
var markdownIt = require('metalsmith-markdown-it-easy');

function fooImageRenderer(tokens, idx, options, env, self) {
    // new rendering logic
}

metalsmith.use(markdownIt({
    html: true,
    linkify: true,
    renderer: {
        rules: {
            image: fooImageRenderer
        }
    }
}));
```

If you need the default rule again, you'll find it in your renderer functions `self` object stored under key `default_rules`, e.g. `default_rules.image`. 

```js
function fooImageRenderer(tokens, idx, options, env, self) {
    if (some_condition) {
        // new rendering logic
    }
    else {
        // use default rule
        return self.default_rules.image(tokens, idx, options, env, self);
    }
}
```

You may not only overwrite `rules` but other renderer keys as well.


## License

MIT