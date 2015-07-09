'use strict';

var Pet = require('../../../models/pet');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/api/pets/cats/{size}',
    config: {
      validate: {
        params: {
          size: Joi.string()
        }
      },
      description: 'Fetch cats of a certain size',
      handler: function(request, reply){
        Pet.find({size: request.params.size}, function(error, cats){
          if(error){return reply().code(400); }

          return reply(cats);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'pets.fetchCatsBySize'
};
