'use strict';

var Pet = require('../../../models/pet');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/api/pets/{id}',
    config: {
      validate: {
        params: {
          id: Joi.string().length(24)
        }
      },
      description: 'Delete a specific pet',
      handler: function(request, reply){
        Pet.findByIdAndRemove(request.params.id, function(error, pet){
          if(error){return reply().code(400); }

          return reply(pet);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'pets.delete'
};
