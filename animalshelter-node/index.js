// This is the JS that contains the hapi.js server and displays startup information.
// When used with nodemon, the server will watch the project folder and attempt to
// restart the server, even after an error has been encountered.

'use strict';

var Hoek = require('hoek');
var Server = require('./lib/server');

Server.init(function(err, server){
  // Hoek is just a set of utilities
  Hoek.assert(!err, err);
  console.log('Animal Shelter');
  console.log('-=-=-=-=-=-=-=');
  console.log('Hapi:\n', server.info.uri);
  console.log('Environment:\n', server.app.environment);
});
