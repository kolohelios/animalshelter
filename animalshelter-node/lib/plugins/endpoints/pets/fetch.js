'use strict';

var Pet = require('../../../models/pet');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/api/pets/{id}',
    config: {
      validate: {
        params: {
          id: Joi.string().length(24)
        }
      },
      description: 'Fetch a specific pet',
      handler: function(request, reply){
        Pet.findById(request.params.id, function(error, pet){
          if(error){return reply().code(400); }

          return reply(pet);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'pets.fetch'
};
