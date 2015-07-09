// here are the tests we use to make sure that the server will start up

/* eslint no-unused-expressions: 0 */
'use strict';

// Chai is our test assertion library
var Chai = require('chai');
// Lab is our test utility and works like 'Mocha'
var Lab = require('lab');
// we'll need Mongoose to disconnect from the database while spinning down the server after it's initialized
var Mongoose = require('mongoose');
// Sinon allows us to mock, stub, and spy; here we're really only stubbing
var Sinon = require('sinon');
// we need to require the server so we can initialize it for the test environment
var Server = require('../lib/server');
// we're including Blipp so that we can stub it out with an error to test a plugin failure
var Blipp = require('blipp');

// these declaration and assignments are mainly for convenient shorthand that reads more like English
// (or Ruby, if I'm recalling correctly)
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

// these tests are mostly self-documenting; we start off by stating which file or path we're testing and
// then we make an English assertion about what should happen; we intialize the server, make our assertions,
// and spin the server down (expect for the plugin failure where the server never started) 
describe('server.js', function(){
  it('should create and start a server', function(done){
    Server.init(function(error, server){
      expect(error).to.not.be.ok;
      expect(server).to.be.ok;
      server.stop(function(){
        Mongoose.disconnect(done);
      });
    });
  });
  it('should encounter a plugin failure', function(done){
    var stub = Sinon.stub(Blipp, 'register').yields(new Error());
    Server.init(function(error, server){
      expect(error).to.be.ok;
      expect(server).to.not.be.ok;
      stub.restore();
      Mongoose.disconnect(done);
    });
  });
});
