'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _processResources = require('./utils/processResources');

var _processResources2 = _interopRequireDefault(_processResources);

var _logger = require('./utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _parseResources = require('./utils/parseResources');

var _parseResources2 = _interopRequireDefault(_parseResources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseQuery = require('loader-utils').parseQuery;

module.exports = function (source) {
  var webpack = this;

  if (webpack.cacheable) webpack.cacheable();

  var callback = webpack.async();

  global.__DEBUG__ = process.env.DEBUG === 'sass-mixins-loader' || process.env.DEBUG === '*';

  _logger2.default.debug('Hey, we\'re in DEBUG mode! Yabba dabba doo!');

  var query = parseQuery(this.query);
  var resourcesLocation = (0, _parseResources2.default)(query.sassResources);
  var moduleContext = webpack.context;
  var webpackConfigContext = webpack.options.context;

  _logger2.default.debug('Module context:', moduleContext);
  _logger2.default.debug('Webpack config context:', webpackConfigContext);

  if (!resourcesLocation) {
    var error = new Error('\n      Could not find sassResources property.\n      Make sure it\'s defined in your webpack config.\n    ');

    return callback(error);
  }

  _logger2.default.debug('sassResources:', resourcesLocation);

  if (!resourcesLocation.length) {
    var _error = new Error('\n      Looks like sassResources property has wrong type.\n      Make sure it\'s String or Array of Strings.\n    ');

    return callback(_error);
  }

  var files = resourcesLocation.map(function (resource) {
    var file = _path2.default.resolve(webpackConfigContext, resource);
    webpack.addDependency(file);
    return file;
  });

  _async2.default.map(files, function (file, cb) {
    return _fs2.default.readFile(file, 'utf8', cb);
  }, function (error, resources) {
    (0, _processResources2.default)(error, resources, source, moduleContext, callback);
  });
};