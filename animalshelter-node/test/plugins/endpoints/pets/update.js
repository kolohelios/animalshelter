// this test set is representative of the endpoints tests that we run; this one is
// a little more complicated only because it requests the record after updating it
// to make sure that the properties were actually updated
//
// more general documentation is available in ./test/index.js

/* eslint no-unused-expressions: 0 */
'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Sinon = require('sinon');
// we need CP to execute the shell script that dumps and loads the test database
var CP = require('child_process');
// Path helps us construct the file path for the script when we execute it
var Path = require('path');
var Server = require('../../../../lib/server');
// we include the Pet model because we're stubbing it out to simulate a database failure in the second test
var Pet = require('../../../../lib/models/pet');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

// the following declarations and assignments again simply allow us to use more English-like code
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('PUT /api/pets/{id}', function(){
  // we initialize the server only once with 'before'
  before(function(done){
    Server.init(function(error, srvr){
      if(error){throw error; }
      server = srvr;
      done();
    });
  });
  // we dump and reload the test mongodb database prior to running each test
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../dumpandloaddb.sh'), [db], {cwd: Path.join(__dirname, '../../../../')}, function(){
      done();
    });
  });
  // disconnect and spin down
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  // here we not only inject a PUT but after retrieve the same record to make sure
  // that indeed all properties were updated
  it('should update Fluffy in the database', function(done){
    server.inject({method: 'PUT', url: '/api/pets/a00000000000000000000001',
    payload: {name: 'Buster', type: 'cat', size: 'large', gender: 'male', color: 'white'}},
    function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Fluffy');
      server.inject({method: 'GET', url: '/api/pets/a00000000000000000000001'}, function(resp){
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.name).to.equal('Buster');
        expect(resp.result.type).to.equal('cat');
        expect(resp.result.size).to.equal('large');
        expect(resp.result.gender).to.equal('male');
        expect(resp.result.color).to.equal('white');
        done();
      });
    });
  });
  // when we stub out the Mongoose model method 'findByIdAndUpdate' with an error,
  // we can simulate a database error (also helpful would be to try to update a
  // record that doesn't exist, or a property of a record, and so on)
  it('should get a 400 error because of a database error', function(done){
    var stub = Sinon.stub(Pet, 'findByIdAndUpdate').yields(new Error());
    server.inject({method: 'PUT', url: '/api/pets/a00000000000000000000001',
    payload: {name: 'Buster', type: 'cat', size: 'large', gender: 'male', color: 'white'}},
    function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
