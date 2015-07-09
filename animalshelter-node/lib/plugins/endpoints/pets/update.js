'use strict';

var Pet = require('../../../models/pet');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/api/pets/{id}',
    config: {
      validate: {
        params: {
          id: Joi.string().length(24)
        },
        payload: {
          name: Joi.string(),
          type: Joi.string(),
          size: Joi.string(),
          gender: Joi.string(),
          color: Joi.string()
        }
      },
      description: 'Update a pet',
      handler: function(request, reply){
        Pet.findByIdAndUpdate(request.params.id, request.payload, function(error, pet){
          if(error){return reply().code(400); }

          return reply(pet);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'pets.update'
};
