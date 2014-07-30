/**
 * Copyright (c) Microsoft.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var should = require('should');
var sinon = require('sinon');
var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var async = require('async');
var isForceMocked = !process.env.NOCK_OFF;

var utils = require('../../lib/util/utils');
var CLITest = require('../framework/cli-test');

// A common VM used by multiple tests
var timeout = isForceMocked ? 0 : 12000;

var suite;
var testPrefix = 'cli.vm.staticvm-tests';
var requiredEnvironment = [{
    name : 'AZURE_VM_TEST_LOCATION',
    defaultValue : 'West US'
  }
];

var currentRandom = 0;

describe('cli', function () {
  describe('vm', function () {
    var vmName,
    location,
    username = 'azureuser',
    password = 'Collabera@01'

      before(function (done) {
        suite = new CLITest(testPrefix, requiredEnvironment, isForceMocked);

        if (suite.isMocked) {
          sinon.stub(crypto, 'randomBytes', function () {
            return (++currentRandom).toString();
          });

          utils.POLL_REQUEST_INTERVAL = 0;
        }
        suite.setupSuite(done);
      });

    after(function (done) {
      var vmEnv = process.env.TEST_VM_NAME;
      function deleteUsedVM(callback) {

        setTimeout(function () {
          var cmd = util.format('vm delete %s -b -q --json', vmEnv).split(' ');
          suite.execute(cmd, function (result) {
            setTimeout(callback, timeout);
          });
        }, timeout);
      }
      if (suite.isMocked) {
        crypto.randomBytes.restore();
      }
      deleteUsedVM(function () {
        suite.teardownSuite(done);
      });
    });

    beforeEach(function (done) {
      suite.setupTest(function () {
        vmName = process.env.TEST_VM_NAME;
        location = process.env.AZURE_VM_TEST_LOCATION;
        done();
      });
    });

    afterEach(function (done) {
      setTimeout(function () {
        suite.teardownTest(done);
      }, timeout);
    });

    describe('static ip operations', function () {
      it('Setting the static ip address to the created VM', function (done) {
        getVnet('Created', function (virtualnetName, affinityName, staticipToCreate, staticipToSet) {
          suite.execute('vm static-ip set %s %s --json', vmName, staticipToSet,
            function (result) {
            result.exitStatus.should.equal(0);
            suite.execute('vm show %s --json', vmName, function (innerresult) {
              innerresult.exitStatus.should.equal(0);
              var vmshow = JSON.parse(innerresult.text);
              vmshow.IPAddress.should.equal(staticipToSet);
              done();
            });
          });
        });
      });

      it('Check if the static ip address set is available', function (done) {
        getVnet('Created', function (virtualnetName, affinityName, staticipToCreate, staticipToSet) {
          suite.execute('network vnet static-ip check %s %s --json', virtualnetName, staticipToSet,
            function (result) {
            result.exitStatus.should.equal(0);
            var vnets = JSON.parse(result.text);
            vnets.isAvailable.should.equal(false);
            done();
          });
        });
      });

      it('Show the description of the vm with set static ip', function (done) {
        getVnet('Created', function (virtualnetName, affinityName, staticipToCreate, staticipToSet) {
          suite.execute('vm static-ip show %s --json', vmName,
            function (result) {
            result.exitStatus.should.equal(0);
            var vnets = JSON.parse(result.text);
            vnets.Network.StaticIP.should.equal(staticipToSet);
            done();
          });
        });
      });

      it('Removing the static ip address', function (done) {
        suite.execute('vm static-ip remove %s --json', vmName,
          function (result) {
          result.exitStatus.should.equal(0);
          done();
        });
      });
    });

    describe('negative testcase', function () {
      it('Setting the invalid static ip address', function (done) {
        suite.execute('vm static-ip set clitestvm2745 ip --json', vmName,
          function (result) {
          result.exitStatus.should.equal(1);
          result.errorText.should.include('The IP address ip is invalid');
          done();
        });
      });

      it('Setting the invalid vm name', function (done) {
        getVnet('Created', function (virtualnetName, affinityName, staticipToCreate, staticipToSet) {
          suite.execute('vm static-ip set abcd %s --json', staticipToSet,
            function (result) {
            result.exitStatus.should.equal(1);
            result.errorText.should.include('No VMs found');
            done();
          });
        });
      });
    });

    //get name of a vnet
    function getVnet(status, callback) {
      var cmd;
      if (getVnet.vnetName) {
        callback(getVnet.vnetName, getVnet.affinityName, getVnet.firstIp, getVnet.secondIp);
      } else {
        cmd = util.format('network vnet list --json').split(' ');
        suite.execute(cmd, function (result) {
          var vnetName = JSON.parse(result.text);
          var found = vnetName.some(function (vnet) {
              if (vnet.state == status) {
                getVnet.vnetName = vnet.name;
                getVnet.affinityName = vnet.affinityGroup;
                var address = vnet.addressSpace.addressPrefixes[0];
                var addressSplit = address.split('/');
                var firstip = addressSplit[0];
                var n = firstip.substring(0, firstip.lastIndexOf('.') + 1);
                var secondip = n.concat(addressSplit[1]);
                getVnet.firstIp = firstip;
                getVnet.secondIp = secondip;
                return true;
              }
            });

          if (!found) {
            getAffinityGroup(location, function (affinGrpName) {
              cmd = util.format('network vnet create %s -a %s --json', vnetName, affinGrpName).split(' ');
              suite.execute(cmd, function (result) {
                getVnet.vnetName = vnetName;
                getVnet.affinityName = affinGrpName;
                var address = vnet.addressSpace.addressPrefixes[0];
                var addressSplit = address.split('/');
                var firstip = addressSplit[0];
                var n = firstip.substring(0, firstip.lastIndexOf('.') + 1);
                var secondip = n.concat(addressSplit[1]);
                getVnet.firstIp = firstip;
                getVnet.secondIp = secondip;
                callback(getVnet.vnetName, getVnet.affinityName, getVnet.firstIp, getVnet.secondIp);
              });
            });
          } else {
            callback(getVnet.vnetName, getVnet.affinityName, getVnet.firstIp, getVnet.secondIp);
          }
        });
      }
    }

    // Get name of an image of the given category
    function getAffinityGroup(location, callBack) {
      if (getAffinityGroup.affinGrpName) {
        callBack(getAffinityGroup.affinGrpName);
      } else {
        suite.execute('account affinity-group list --json', function (result) {
          var affinList = JSON.parse(result.text);
          var found = affinList.some(function (affinGrp) {
              if (affinGrp.location == location) {
                getAffinityGroup.affinGrpName = affinGrp.name;
                return true;
              }
            });
          if (!found) {
            suite.execute('account affinity-group create -l %s -e %s -d %s %s --json',
              location, affinLabel, affinDesc, affinityName, function (result) {
              getAffinityGroup.affinGrpName = affinityName;
              callBack(affinityName);
            });
          } else
            callBack(getAffinityGroup.affinGrpName);
        });
      }
    }
  });
});