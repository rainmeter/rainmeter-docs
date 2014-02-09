var path = require('path');

hexo.extend.helper.register('rel', function(from, to) {
  return path.relative(path.dirname(from), to).replace(/\\/g, '/');
});