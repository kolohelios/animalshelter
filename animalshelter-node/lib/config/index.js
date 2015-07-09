// two environments for now, dev and test; dev is set as our default using the null coalescing operator on line 7
// we let hapi.js chose its own port when we're doing testing, and each env has it's own accompanying mongodb server

'use strict';

exports.get = function(){
  var env = process.env.NODE_ENV || 'development';

  var environments = {
    development: {
      NODE_ENV: env,
      PORT: process.env.PORT || 8000,
      MONGO_URL: 'mongodb://localhost/animalshelter-dev'
    },
    test: {
      NODE_ENV: env,
      PORT: process.env.PORT || 0,
      MONGO_URL: 'mongodb://localhost/animalshelter-test'
    }
  };

  return environments[env];
};
