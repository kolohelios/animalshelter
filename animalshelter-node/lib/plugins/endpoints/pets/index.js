'use strict';

var Pet = require('../../../models/pet');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/api/pets',
    config: {
      description: 'Get a list of all pets',
      handler: function(request, reply){
        Pet.find(function(error, pets){
          if(error){return reply().code(400); }

          return reply(pets);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'pets.index'
};
