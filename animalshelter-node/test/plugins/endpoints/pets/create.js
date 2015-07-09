/* eslint no-unused-expressions: 0 */
'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('POST /api/pets', function(){
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
  it('should create a new pet and update database', function(done){
    server.inject({method: 'POST', url: '/api/pets',
    payload: {name: 'Bunny', type: 'cat', size: 'medium', gender: 'female', color: 'brown'}},
    function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Bunny');
      expect(response.result.type).to.equal('cat');
      expect(response.result.size).to.equal('medium');
      expect(response.result.gender).to.equal('female');
      expect(response.result.color).to.equal('brown');
      server.inject({method: 'GET', url: '/api/pets'}, function(resp){
        expect(resp.statusCode).to.equal(200);
        expect(resp.result.length).to.equal(3);
        expect(resp.result[2].name).to.equal('Bunny');
        done();
      });
    });
  });
});
