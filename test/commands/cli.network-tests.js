//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//
var should = require('should');
var util = require('util');
var testUtils = require('../util/util');
var CLITest = require('../framework/cli-test');
var networkconfig = 'netconfig.json';
var suite;
var testPrefix = 'cli.network-tests';

var retry = 5;
var requiredEnvironment = [{
    name : 'AZURE_SITE_TEST_LOCATION',
    defaultValue : 'West US'
  }
];

var testSite;

describe('cli', function () {
  describe('network', function () {
    testUtils.TIMEOUT_INTERVAL = 5000;
    before(function (done) {
      suite = new CLITest(testPrefix, requiredEnvironment);
      suite.setupSuite(done);
    });

    after(function (done) {
      suite.teardownSuite(done);
    });

    beforeEach(function (done) {
      suite.setupTest(function () {
        testSite = process.env['AZURE_SITE_TEST_LOCATION'];
        done();
      });
    });

    afterEach(function (done) {
      suite.teardownTest(done);
    });

    describe('dnsserver', function () {
      var dnsIp = '10.0.0.1';

      afterEach(function (done) {
        suite.execute('network dnsserver unregister %s --quiet --json', dnsIp, function () {
          done();
        });
      });

      it('should create and list', function (done) {
        suite.execute('network dnsserver register %s --json', dnsIp, function (result) {
          result.exitStatus.should.equal(0);

          suite.execute('network dnsserver list --json', function (result) {
            result.exitStatus.should.equal(0);
            var dnsServers = JSON.parse(result.text);
            var exists = dnsServers.some(function (v) {
                return v.IPAddress === dnsIp;
              });

            exists.should.equal(true);
            done();
          });
        });
      });
    });

    describe('vnet', function () {
      var vnetName = 'vnet1';

      afterEach(function (done) {
        suite.execute('network vnet delete %s --quiet --json', vnetName, function () {
          done();
        });
      });

      it('should create vnet, show , import and list', function (done) {
        suite.execute('network vnet create %s --address-space 10.0.0.0 --json --location %s',
          vnetName, testSite, function (result) {

          result.exitStatus.should.equal(0);

          suite.execute('network vnet list --json', function (outerresult) {
            result.exitStatus.should.equal(0);
            result.text.should.not.be.null;

            suite.execute('network export %s --json', networkconfig, function (result) {
              result.exitStatus.should.equal(0);
              cmd = util.format('network vnet delete %s --quiet --json', vnetName).split(' ');
              testUtils.executeCommand(suite, retry, cmd, function (result) {
                  result.exitStatus.should.equal(0);
                  suite.execute('network import %s --json', networkconfig, function (result) {
                  result.exitStatus.should.equal(0);

                  var vnets = JSON.parse(outerresult.text);
                  var vnet = vnets.filter(function (v) {
                      return v.name === vnetName;
                    })[0];

                  vnet.should.not.equal(null);
                  vnet.state.should.equal('Created');
                  vnet.addressSpace.addressPrefixes[0].should.equal('10.0.0.0/8');
                  vnet.subnets[0].name.should.equal('Subnet-1');
                  vnet.subnets[0].addressPrefix.should.equal('10.0.0.0/11');

                  suite.execute('network vnet show %s --json', vnetName, function (result) {
                    result.exitStatus.should.equal(0);
                    result.text.should.not.be.null;

                    var vnet = JSON.parse(result.text);
                    vnet.should.not.equal(null);
                    vnet.state.should.equal('Created');
                    vnet.addressSpace.addressPrefixes[0].should.equal('10.0.0.0/8');
                    vnet.subnets[0].name.should.equal('Subnet-1');
                    vnet.subnets[0].addressPrefix.should.equal('10.0.0.0/11');

                    done();
                  });
                });
              });
            });
          });
        });
      });

      it('should create vnet with dns-server-id option and show', function (done) {
        var dnsIp = '66.77.88.99';
        var dnsId = 'dns-cli-0';

        suite.execute('network dnsserver register %s --json --dns-id %s', dnsIp, dnsId, function (result) {
          result.exitStatus.should.equal(0);

          suite.execute('network dnsserver list --json', function (result) {
            result.exitStatus.should.equal(0);

            var dnsServers = JSON.parse(result.text);
            var dnsServer = dnsServers.filter(function (v) {
                return v.Name === dnsId;
              })[0];

            dnsServer.should.not.equal(null);

            suite.execute('network vnet create %s --address-space 10.0.0.0 --json --location %s --dns-server-id %s',
              vnetName, testSite, dnsId, function (result) {

              result.text.should.not.be.null;
              result.exitStatus.should.equal(0);

              suite.execute('network vnet show %s --json', vnetName, function (result) {
                result.exitStatus.should.equal(0);
                result.text.should.not.be.null;

                var vnet = JSON.parse(result.text);
                vnet.should.not.equal(null);
                vnet.state.should.equal('Created');
                vnet.dnsServers[0].name.should.equal(dnsId);

                suite.execute('network vnet delete %s --quiet --json', vnetName, function () {
                  suite.execute('network dnsserver unregister %s --quiet --json', dnsIp, function () {
                    done();
                  });
                })
              });
            });
          });
        });
      });
    });
  });
});