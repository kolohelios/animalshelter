// this is our model for this project; it is imported using 'require' into the applicable tests and endpoints

'use strict';

var Mongoose = require('mongoose');

var petSchema = Mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  size: {type: String, required: true},
  gender: {type: String, required: true},
  color: {type: String, required: true}
});

var Pet = Mongoose.model('Pet', petSchema);

module.exports = Pet;
