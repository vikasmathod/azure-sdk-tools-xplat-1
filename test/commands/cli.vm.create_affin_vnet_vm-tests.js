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
var testPrefix = 'cli.vm.create_affin_vnet_vm-tests';
var requiredEnvironment = [{
  name: 'AZURE_VM_TEST_LOCATION',
  defaultValue: 'West US'
}];

describe('cli', function() {
  describe('vm', function() {
    var affinityName = 'xplataffintest',
      vmVnetName,
      affinLabel = 'xplatAffinGrp',
      affinDesc = 'Test Affinty Group for xplat',
      location,
      availSetName = 'Testset',
      userName = 'azureuser',
      password = 'Pa$$word@123',
      timeout,
      retry;
    testUtils.TIMEOUT_INTERVAL = 5000;

    var vmToUse = {
      Name: null,
      Created: false,
      Delete: false
    };

    before(function(done) {
      suite = new CLITest(testPrefix, requiredEnvironment);
      vmVnetName = suite.isMocked ? 'xplattestvmVnet' : suite.generateId(vmPrefix, null) + 'Vnet';
      suite.setupSuite(done);
    });

    after(function(done) {
      suite.teardownSuite(done);
    });

    beforeEach(function(done) {
      suite.setupTest(function() {
        location = process.env.AZURE_VM_TEST_LOCATION;
        timeout = suite.isMocked ? 0 : testUtils.TIMEOUT_INTERVAL;
        retry = 5;
        done();
      });
    });

    afterEach(function(done) {
      function deleteUsedVM(vm, callback) {
        if (vm.Created && vm.Delete) {
          setTimeout(function() {
            var cmd = util.format('vm delete %s -b -q --json', vm.Name).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function(result) {
              result.exitStatus.should.equal(0);
              vm.Name = null;
              vm.Created = vm.Delete = false;
              callback();
            });
          }, timeout);
        } else {
          callback();
        }
      }

      deleteUsedVM(vmToUse, function() {
        suite.teardownTest(done);
      });
    });

    //create a vm with affinity group, vnet and availibilty set
    describe('Create:', function() {
      it('Vm with affinity, vnet and availibilty set', function(done) {
        vmUtility.getImageName('Linux', function(imageName) {
          vmUtility.getVnet('Created', function(virtualnetName, affinityName) {
            var cmd = util.format('vm create -A %s -n %s -a %s -w %s %s %s %s %s --json',
              availSetName, vmVnetName, affinityName, virtualnetName, vmVnetName, imageName, userName, password).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function(result) {
              result.exitStatus.should.equal(0);
              vmToUse.Created = true;
              vmToUse.Name = vmVnetName;
              vmToUse.Delete = true;
              done();
            });
          });
        });
      });
    });
  });
});