// all of the endpoints are similar; we do validation where possible though index.js does not have any

'use strict';

//load the model we need
var Pet = require('../../../models/pet');
// we do our validation with 'Joi'
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/api/pets',
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          type: Joi.string().required(),
          size: Joi.string().required(),
          gender: Joi.string().required(),
          color: Joi.string().required()
        }
      },
      description: 'Create a new pet',
      handler: function(request, reply){
        // using the payload, we create a new pet object using the model and save it to the database
        var pet = new Pet(request.payload);
        pet.save();
        // note that returning pet in this manner does NOT guarantee that it has been saved in the database; we do
        // test for this condition; however, there should be better confirmation before returning pet in case there is
        // a temporary database failure that prevents the record from being committed
        return reply(pet);
      }
    }
  });
  return next();
};

// finally, register the plugin so the server can establish the route as an endpoint
exports.register.attributes = {
  name: 'pets.create'
};
