
var basename = require('path').basename;
var debug = require('debug')('metalsmith-markdown');
var dirname = require('path').dirname;
var extname = require('path').extname;

var MarkdownIt = require('markdown-it');
var md;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object?} options (optional)
 *   @property {Array?} plugins Each with the plugin instance and optional options as specified by the markdown-it-plugin
 *     [markdown-it-plugin-1-instance, optional plugin-1-options],
 *     [markdown-it-plugin-2-instance, optional plugin-2-option, another optional plugin-2-option]
 *     ... 
 *   @property {Object?} renderer Use to overwrite the markdown-it renderer options,
 *     e.g. renderer: {rules: {image: fooImageRenderer}}
 * @return {Function}
 */

function plugin(options){
  options = options || {};
  md = new MarkdownIt(options);

  // options.plugins
  var mdPlugins = options['plugins'];
  if(mdPlugins) {
    mdPlugins.forEach(function(mdPlugin) {
      debug('markdown-it plugin to use: %O', mdPlugin);
      if (mdPlugin instanceof Array) {
        MarkdownIt.prototype.use.apply(md, mdPlugin);
      }
      else {
        md.use(mdPlugin);
      }
    });
  }

  // options.renderer
  var mdRenderer = options['renderer'];
  if (mdRenderer) {
    Object.keys(mdRenderer).forEach(function(key){
      // save defaults to default_{key}, e.g. renderer.rules -> renderer.default_rules
      md.renderer['default_' + key] = {};
      Object.assign(md.renderer['default_' + key], md.renderer[key]);
      // copy renderer options to renderer
      Object.assign(md.renderer[key], mdRenderer[key]);      
    });
  }
    
  return function(files, metalsmith, done){
    setImmediate(done);

    Object.keys(files).forEach(function(file){
      if (!markdown(file)) return;
      debug('checking file: %s', file);
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('converting file: %s', file);
    
      var str = md.render(data.contents.toString());
      data.contents = new Buffer(str);

      delete files[file];
      files[html] = data;
    });
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function markdown(file){
  return /\.md|\.markdown/.test(extname(file));
}