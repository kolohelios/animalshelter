'use strict';

var Pet = require('../../../models/pet');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/api/pets/dogs/{size}',
    config: {
      validate: {
        params: {
          size: Joi.string()
        }
      },
      description: 'Fetch dogs of a certain size',
      handler: function(request, reply){
        Pet.find({size: request.params.size}, function(error, dogs){
          if(error){return reply().code(400); }

          return reply(dogs);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'pets.fetchDogsBySize'
};
