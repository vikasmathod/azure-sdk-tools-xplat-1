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
// A common VM used by multiple tests
var vmUtility = require('../util/VMTestUtil');
var suite;
var vmPrefix = 'clitestvm';
var testPrefix = 'cli.vm.extension_set-custom_disable';
var requiredEnvironment = [{
  name: 'AZURE_VM_TEST_LOCATION',
  defaultValue: 'West US'
}];
describe('cli', function() {
  describe('vm', function() {
    var vmName,
      location,
      username = 'azureuser',
      password = 'PassW0rd$',
      retry = 5,
      customScript = 'test/data/customScript.json',
      customextension = 'CustomScriptExtension',
      custompublisher = 'Microsoft.Compute',
      customversion = '1.*',
      timeout;
    testUtils.TIMEOUT_INTERVAL = 5000;
    before(function(done) {
      suite = new CLITest(testPrefix, requiredEnvironment);
      suite.setupSuite(done);
    });
    after(function(done) {
      function deleteUsedVM(callback) {
        if (!suite.isMocked) {
          setTimeout(function() {
            var cmd = util.format('vm delete %s -b -q --json', vmName).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function(result) {
              result.exitStatus.should.equal(0);
              setTimeout(callback, timeout);
            });
          }, timeout);
        } else callback();
      }
      deleteUsedVM(function() {
        suite.teardownSuite(done);
      });
    });
    beforeEach(function(done) {
      suite.setupTest(function() {
        location = process.env.AZURE_VM_TEST_LOCATION;
        vmName = suite.isMocked ? 'xplattestvm' : suite.generateId(vmPrefix, null);
        timeout = suite.isMocked ? 0 : testUtils.TIMEOUT_INTERVAL;
        done();
      });
    });
    afterEach(function(done) {
      setTimeout(function() {
        suite.teardownTest(done);
      }, timeout);
    });
    //Set custom extensions
    describe('extension:', function() {
      it('Set custom extensions and disable', function(done) {
        createVM(function() {
          var cmd = util.format('vm extension set -c %s %s %s %s %s --json', customScript, vmName, customextension, custompublisher, customversion).split(' ');
          testUtils.executeCommand(suite, retry, cmd, function(result) {
            result.exitStatus.should.equal(0);
            cmd = util.format('vm extension set -b %s %s %s %s --json', vmName, customextension, custompublisher, customversion).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function(result) {
              result.exitStatus.should.equal(0);
              cmd = util.format('vm extension get %s --json', vmName).split(' ');
              testUtils.executeCommand(suite, retry, cmd, function(result) {
                result.exitStatus.should.equal(0);
                var Extensions = JSON.parse(result.text);
                Extensions[0].state.should.equal('Disable');
                done();
              });
            });
          });
        });
      });
    });

    function createVM(callback) {
        vmUtility.getImageName('Windows', function(imagename) {
          var cmd = util.format('vm create %s %s %s %s --json', vmName, imagename, username, password).split(' ');
          cmd.push('-l');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function(result) {
            result.exitStatus.should.equal(0);
            setTimeout(callback, timeout);
          });
        });
      }
  });
});