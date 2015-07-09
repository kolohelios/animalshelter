/* eslint no-unused-expressions: 0 */
'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Sinon = require('sinon');
var CP = require('child_process');
var Path = require('path');
var Server = require('../../../../lib/server');
var Pet = require('../../../../lib/models/pet');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('GET /api/pets', function(){
  before(function(done){
    Server.init(function(error, srvr){
      if(error){throw error; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../dumpandloaddb.sh'), [db], {cwd: Path.join(__dirname, '../../../../')}, function(){
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should get a list of all pets', function(done){
    server.inject({method: 'GET', url: '/api/pets'}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.length).to.equal(2);
      done();
    });
  });
  it('should get a 400 error because of a database error', function(done){
    var stub = Sinon.stub(Pet, 'find').yields(new Error());
    server.inject({method: 'GET', url: '/api/pets'}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
