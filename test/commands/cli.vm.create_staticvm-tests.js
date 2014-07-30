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

var vmPrefix = 'clitestvm';
var vmNames = [];
var timeout = isForceMocked ? 0 : 12000;

var suite;
var testPrefix = 'cli.vm.create_staticvm-tests';
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
        process.env.TEST_VM_NAME = isForceMocked ? 'xplattestvm' : suite.generateId(vmPrefix, null);
        suite.setupSuite(done);
      });

    after(function (done) {
      if (suite.isMocked) {
        crypto.randomBytes.restore();
      }
      suite.teardownSuite(done);
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

    //create a vm with static-ip set
    describe('Create a VM with static ip address:', function () {
      it('Create a VM with static ip address', function (done) {
        getImageName('Windows', function (ImageName) {
          getVnet('Created', function (virtualnetName, affinityName, staticIpToCreate, staticIpToSet) {
            suite.execute('vm create --virtual-network-name %s -n %s --affinity-group %s %s %s %s %s --static-ip %s --json',
              virtualnetName, vmName, affinityName, vmName, ImageName, username, password, staticIpToCreate, function (result) {
              result.exitStatus.should.equal(0);
              done();
            });
          });
        });
      });
    });

    // VM Restart
    describe('Restart and check:', function () {
      it('Restart', function (done) {
        suite.execute('vm restart  %s --json', vmName, function (result) {
          result.exitStatus.should.equal(0);
          done();
        });
      });

      it('Show the description of the vm with set static ip', function (done) {
        getVnet('Created', function (virtualnetName, affinityName, staticipToCreate, staticipToSet) {
          suite.execute('vm static-ip show %s --json', vmName,
            function (result) {
            result.exitStatus.should.equal(0);
            var vnets = JSON.parse(result.text);
            vnets.Network.StaticIP.should.equal(staticipToCreate);
            done();
          });
        });
      });
    });

    // Get name of an image of the given category
    function getImageName(category, callBack) {
      var cmd = util.format('vm image list --json').split(' ');
      suite.execute(cmd, function (result) {
        var imageList = JSON.parse(result.text);
        imageList.some(function (image) {
          if ((image.operatingSystemType || image.oSDiskConfiguration.operatingSystem).toLowerCase() === category.toLowerCase() && image.category.toLowerCase() === 'public') {
            vmImgName = image.name;
            return true;
          }
        });
        callBack(vmImgName);
      });
    }

    //get name of a vnet
    function getVnet(status, callback) {
      var cmd;
      if (getVnet.vnetName) {
        callback(getVnet.vnetName, getVnet.affinityName, getVnet.staticIpToCreate, getVnet.staticIpToSet);
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
                var staticIpToCreate = addressSplit[0];
                var n = staticIpToCreate.substring(0, staticIpToCreate.lastIndexOf('.') + 1);
                var staticIpToSet = n.concat(addressSplit[1]);
                getVnet.staticIpToCreate = staticIpToCreate;
                getVnet.staticIpToSet = staticIpToSet;
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
                var staticIpToCreate = addressSplit[0];
                var n = staticIpToCreate.substring(0, staticIpToCreate.lastIndexOf('.') + 1);
                var staticIpToSet = n.concat(addressSplit[1]);
                getVnet.staticIpToCreate = staticIpToCreate;
                getVnet.staticIpToSet = staticIpToSet;
                callback(getVnet.vnetName, getVnet.affinityName, getVnet.staticIpToCreate, getVnet.staticIpToSet);
              });
            });
          } else {
            callback(getVnet.vnetName, getVnet.affinityName, getVnet.staticIpToCreate, getVnet.staticIpToSet);
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