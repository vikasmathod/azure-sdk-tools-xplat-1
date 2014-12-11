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
var CLITest = require('../framework/cli-test');
var fs = require('fs');
var util = require('util');
var exports = module.exports;
var testUtils = require('../util/util');
var retry = 5;
var testPrefix = 'cli.vm.create_affin_vnet_vm-tests';
var requiredEnvironment = [{
    name : 'AZURE_VM_TEST_LOCATION',
    defaultValue : 'West US'
  }
];
//This is the timeout variable that would be used by all vm set of tests. This timeout value would differ from one test to another.
exports.TIMEOUT_INTERVAL = 10000;
var suite = new CLITest(testPrefix, requiredEnvironment);
// suite.setupSuite(done);
exports.getImageName = function getImageName(category, callBack) {
  if (process.env.VM_LINUX_IMAGE) {
    callBack(process.env.VM_LINUX_IMAGE);
  } else {
    var cmd = util.format('vm image list --json').split(' ');
    testUtils.executeCommand(suite, retry, cmd, function (result) {
      result.exitStatus.should.equal(0);
      var imageList = JSON.parse(result.text);
      imageList.some(function (image) {
        if ((image.operatingSystemType || image.oSDiskConfiguration.operatingSystem).toLowerCase() === category.toLowerCase() && image.category.toLowerCase() === 'public') {
          process.env.VM_LINUX_IMAGE = image.name;
          return true;
        }
      });
      callBack(process.env.VM_LINUX_IMAGE);
    });
  }
}

//get name of a vnet
exports.getVnet = function getVnet(status, callback) {
  var cmd;
  if (getVnet.vnetName) {
    callback(getVnet.vnetName, getVnet.affinityName);
  } else {
    cmd = util.format('network vnet list --json').split(' ');
    testUtils.executeCommand(suite, retry, cmd, function (result) {
      result.exitStatus.should.equal(0);
      var vnetName = JSON.parse(result.text);
      var found = vnetName.some(function (vnet) {
          if (vnet.state.toLowerCase() === status.toLowerCase() && vnet.affinityGroup !== undefined) {
            getVnet.vnetName = vnet.name;
            getVnet.affinityName = vnet.affinityGroup;
            return true;
          }
        });

      if (!found) {
        getAffinityGroup(location, function (affinGrpName) {
          cmd = util.format('network vnet create %s -a %s --json', vnetName, affinGrpName).split(' ');
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.equal(0);
            getVnet.vnetName = vnetName;
            getVnet.affinityName = affinGrpName;
            callback(getVnet.vnetName, getVnet.affinityName);
          });
        });
      } else {
        callback(getVnet.vnetName, getVnet.affinityName);
      }
    });
  }
}

exports.getAffinityGroup = function getAffinityGroup(location, callBack) {
  var cmd;
  if (getAffinityGroup.affinGrpName) {
    callBack(getAffinityGroup.affinGrpName);
  } else {
    cmd = util.format('account affinity-group list --json').split(' ');
    testUtils.executeCommand(suite, retry, cmd, function (result) {
      result.exitStatus.should.equal(0);
      var affinList = JSON.parse(result.text);
      var found = affinList.some(function (affinGrp) {
          if (affinGrp.location === location) {
            getAffinityGroup.affinGrpName = affinGrp.name;
            return true;
          }
        });
      if (!found) {
        cmd = util.format('account affinity-group create -l %s -e %s -d %s %s --json',
            location, affinLabel, affinDesc, affinityName).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          getAffinityGroup.affinGrpName = affinityName;
          callBack(affinityName);
        });
      } else
        callBack(getAffinityGroup.affinGrpName);
    });
  }
}

exports.createVM = function createVM(callback) {
  this.getImageName('Linux', function (imagename) {
    var cmd = util.format('vm create %s %s %s %s --json', vmName, imagename, username, password).split(' ');
    cmd.push('-l');
    cmd.push(location);
    testUtils.executeCommand(suite, retry, cmd, function (result) {
      result.exitStatus.should.equal(0);
      vmToUse.Name = vmName;
      vmToUse.Created = true;
      setTimeout(callback, timeout);
    });
  });
}