// This JS initializes our server.

'use strict';

// we're using hapi.js instead of Express for this project (although I do plan on learning Express in the near future)
var Hapi = require('hapi');
// we use Mongoose to connect us to the database
var Mongoose = require('mongoose');
// Config contains the environmental variables from ./lib/config/index.js
var Config = require('./config');
// Server sets up our CORS (Cross-Origin Resource Sharing) so we can have separate front- and back-end servers.
var Server = require('./config/server');
// specify the plugins to be registered below (more comments in ./lib/tools/plugins.js)
var Plugins = require('./tools/plugins');

exports.init = function(callback){
  var server = new Hapi.Server(Server);
  server.app.environment = Config.get();
  server.connection({port: server.app.environment.PORT});
  Mongoose.connect(server.app.environment.MONGO_URL);

  Mongoose.connection.once('open', function(){
    server.register(Plugins, function(pluginError){
      // if there's an error with a plugin, we should not start the server
      if(pluginError){return callback(pluginError); }

      // and we're spinning!
      server.start(function(err){
        return callback(err, server);
      });
    });
  });
};
