// this test set makes sure that our environmental variables are being set properly; more general documentation
// is available in ./test/index.js

/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
// we require Config so that we can directly access the environmental variables; no
// servers are "harmed" in this test
var Config = require('../../lib/config');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;

describe('config', function(){
  it('should erase all env variables', function(done){
    var oldEnv = process.env;
    process.env = {};
    var environment = Config.get();
    expect(environment.NODE_ENV).to.equal('development');
    process.env = oldEnv;
    done();
  });
  it('should set the PORT env', function(done){
    process.env.PORT = 3333;
    var environment = Config.get();
    expect(environment.NODE_ENV).to.equal('test');
    expect(environment.PORT).to.equal('3333');
    delete process.env.PORT;
    done();
  });
});
