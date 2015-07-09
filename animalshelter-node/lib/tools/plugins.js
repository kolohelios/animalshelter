// Blipp shows us a list of routes at startup and plunge allows us to register
// server plugins without specifiying them (it recursively searches for plugins and registers them for us)

'use strict';

var Plugins = require('./plunge');
var Blipp = require('blipp');

Plugins.push(Blipp);

module.exports = Plugins;
