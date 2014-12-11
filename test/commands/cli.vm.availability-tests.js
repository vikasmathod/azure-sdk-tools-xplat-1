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
var util = require('util');
var testUtils = require('../util/util');
var CLITest = require('../framework/cli-test');
var vmUtility = require('../util/VMTestUtil');
var suite;
var vmPrefix = 'clitestvm';
var testPrefix = 'cli.vm.availability-tests';

var requiredEnvironment = [{
    name : 'AZURE_VM_TEST_LOCATION',
    defaultValue : 'West US'
  }
];

describe('cli', function () {
  describe('vm', function () {
    var affinityName = 'xplataffintest',
    vmName,
    timeout,
    affinLabel = 'xplatAffinGrp',
    affinDesc = 'Test Affinty Group for xplat',
    location,
    version,
    availabilityset = 'xplatavail',
    userName = 'azureuser',
    password = 'Collabera@01',
    retry = 5;
    testUtils.TIMEOUT_INTERVAL = 10000;

    before(function (done) {
      suite = new CLITest(testPrefix, requiredEnvironment);
      vmName = suite.isMocked ? 'xplattestvm' : suite.generateId(vmPrefix, null);
      suite.setupSuite(done);
    });

    after(function (done) {
      function deleteUsedVM(callback) {
        if (!suite.isMocked) {
          setTimeout(function () {
            var cmd = util.format('vm delete %s -b -q --json', vmName).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function (result) {
              result.exitStatus.should.equal(0);
              setTimeout(callback, timeout);
            });
          }, timeout);
        } else
          callback();
      }

      deleteUsedVM(function () {
        suite.teardownSuite(done);
      });
    });

    beforeEach(function (done) {
      suite.setupTest(function () {
        location = process.env.AZURE_VM_TEST_LOCATION;
        storageAccountKey = process.env.AZURE_STORAGE_ACCESS_KEY
          timeout = suite.isMocked ? 0 : testUtils.TIMEOUT_INTERVAL;
        done();
      });
    });

    afterEach(function (done) {
      suite.teardownTest(done);
    });

    //Create a VM with availability set 
    describe('Disk:', function () {
      it('Vm with availability set', function (done) {
        getImageName('Linux', function (imageName) { 
          var cmd = util.format('vm create --availability-set %s %s %s %s %s --json',
              availabilityset, vmName, imageName, userName, password).split(' ');
          cmd.push('-l');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.equal(0);
            done();
          });
        });
      });

      //List extensions
      it('List extensions', function (done) {
        var listcmd = util.format('vm extension list --json').split(' ');
        testUtils.executeCommand(suite, retry, listcmd, function (outerresult) {
          outerresult.exitStatus.should.equal(0);
          var extnarr = JSON.parse(outerresult.text);
          var found = extnarr.some(function (ext) {
              extensionname = ext.name;
              publishername = ext.publisher;
              version = ext.version;
              return true;
            });
          done();
        });
      });

      //Set extensions
      it('Set extensions for the created vm', function (done) { 
        var cmd = util.format('vm extension set %s %s %s %s --json',
            vmName, extensionname, publishername, version).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          done();
        });
      });

      it('get the details of extensions on the VM set', function (done) {
        var cmd = util.format('vm extension get %s --json', vmName).split(' ');
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          extensionList = JSON.parse(result.text);
		  extensionList.length.should.be.above(0);
		  extensionList[0].name.should.equal(extensionname);
		  extensionList[0].publisher.should.equal(publishername);
          done();
        });
      });
    });

    function createVM(callback) {
      getImageName('Windows', function (imagename) {
        var cmd = util.format('vm create %s %s %s %s --json', vmName, imagename, userName, password).split(' ');
        cmd.push('-l');
        cmd.push(location);
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          setTimeout(callback, timeout);
        });
      });
    }

    function getImageName(category, callBack) {
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

    function getVM(callback) {
      if (getVM.VMName) {
        callback(getVM.VMName);
      } else {
        var cmd = util.format('vm list --json').split(' ');
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          var vmList = JSON.parse(result.text);
          var found = vmList.some(function (vm) {
              if (vm.OSDisk.operatingSystem.toLowerCase() === 'windows') {
                getVM.VMName = vm.VMName;
                return true;
              }
            });
          callback(getVM.VMName);
        });
      }
    }
  });
});