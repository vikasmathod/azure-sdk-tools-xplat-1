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
var path = require('path');
var fs = require('fs');
var testUtils = require('../util/util');
var vmUtility = require('../util/VMTestUtil');
var CLITest = require('../framework/cli-test');
var sinon = require('sinon');
var crypto = require('crypto');
var suite;
var vmPrefix = 'clitestvm';
var testPrefix = 'cli.vm.create_docker-tests';
var requiredEnvironment = [{
    name : 'AZURE_VM_TEST_LOCATION',
    defaultValue : 'West US'
  }, {
    name : 'AZURE_COMMUNITY_IMAGE_ID',
    defaultValue : null
  }
];
var currentRandom = 0;
describe('cli', function () {
  describe('vm', function () {
    var vmName,
    dockerCertDir,
    dockerCerts,
    location,
    retry = 5,
    homePath,
    timeout,
    username = 'azureuser',
    password = 'Pa$$word@123',
    ripName = 'clitestrip',
    ripCreate = false;
    testUtils.TIMEOUT_INTERVAL = 12000;

    // A common VM used by multiple tests
    var vmToUse = {
      Name : null,
      Created : false,
      Delete : false
    };

    before(function (done) {
      suite = new CLITest(testPrefix, requiredEnvironment);
      if (suite.isMocked) {
        sinon.stub(crypto, 'randomBytes', function () {
          return (++currentRandom).toString();
        });
      }
      suite.setupSuite(done);
    });

    after(function (done) {
      if (suite.isMocked) {
        crypto.randomBytes.restore();
      }
      if (ripCreate) {
        deleterip(function () {
          suite.teardownSuite(done);
        });
      } else {
        suite.teardownSuite(done);
      }
    });

    beforeEach(function (done) {
      suite.setupTest(function () {
        location = process.env.AZURE_VM_TEST_LOCATION;
        vmName = suite.isMocked ? 'XplattestVm' : suite.generateId(vmPrefix, null);
        communityImageId = process.env.AZURE_COMMUNITY_IMAGE_ID;
        timeout = suite.isMocked ? 0 : testUtils.TIMEOUT_INTERVAL;
        homePath = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
        done();
      });
    });

    afterEach(function (done) {
      function deleteUsedVM(vm, callback) {
        if (vm.Created && vm.Delete) {
          setTimeout(function () {
            var cmd = util.format('vm delete %s -b --quiet --json', vm.Name).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function (result) {
              result.exitStatus.should.equal(0);
              vm.Name = null;
              vm.Created = vm.Delete = false;
              return callback();
            });
          }, timeout);
        } else {
          return callback();
        }
      }

      function deleteDockerCertificates() {
        if (!dockerCertDir || !dockerCerts) {
          return;
        }

        fs.exists(dockerCertDir, function (exists) {
          if (!exists) {
            return;
          }

          fs.unlinkSync(dockerCerts.caKey);
          fs.unlinkSync(dockerCerts.ca);
          fs.unlinkSync(dockerCerts.serverKey);
          fs.unlinkSync(dockerCerts.server);
          fs.unlinkSync(dockerCerts.serverCert);
          fs.unlinkSync(dockerCerts.clientKey);
          fs.unlinkSync(dockerCerts.client);
          fs.unlinkSync(dockerCerts.clientCert);
          fs.unlinkSync(dockerCerts.extfile);
          fs.rmdirSync(dockerCertDir);
        });
      }

      deleteUsedVM(vmToUse, function () {
        suite.teardownTest(done);
        deleteDockerCertificates();
      });
    });

    describe('Vm Create: ', function () {
      it('Create Docker VM with community', function (done) {
        vmUtility.getImageName('Linux', function (ImageName) {
          var cmd = util.format('vm docker create %s -o %s %s %s -l %s',
              vmName, communityImageId, username, password).split(' ');
          cmd.push('--location');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.equal(0);
            vmToUse.Name = vmName;
            vmToUse.Created = true;
            vmToUse.Delete = true;
            setTimeout(done, timeout);
          });
        });
      });

      //Nock is yet to be generated for this testcase
      it('Create Docker VM with invalid name should throw error and delete the created cloud service', function (done) {
        getImageName('Linux', function (ImageName) {
          var cmd = util.format('vm docker create %s %s %s %s --json',
              vmName, ImageName, Invalidusername, password).split(' ');
          cmd.push('--location');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.not.equal(1);
            var cmd = util.format('service show %s', vmName).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function (result) {
              result.exitStatus.should.not.equal(1);
              setTimeout(done, timeout);
            });
          });
        });
      });

      it('Create Docker VM with default values and reserved Ip should pass', function (done) {
        dockerCertDir = path.join(homePath, '.docker');
        var dockerPort = 4243;

        vmUtility.getImageName('Linux', function (ImageName) {
          createReservedIp(location, function (ripName) {
            var cmd = util.format('vm docker create %s %s %s %s -R %s --json --ssh',
                vmName, ImageName, username, password, ripName).split(' ');
            cmd.push('--location');
            cmd.push(location);
            testUtils.executeCommand(suite, retry, cmd, function (result) {
              result.exitStatus.should.equal(0);
              cmd = util.format('vm show %s --json', vmName).split(' ');
              testUtils.executeCommand(suite, retry, cmd, function (result) {
                result.exitStatus.should.equal(0);
                var certificatesExist = checkForDockerCertificates(dockerCertDir);
                certificatesExist.should.be.true;
                var createdVM = JSON.parse(result.text);
                var dockerPortExists = checkForDockerPort(createdVM, dockerPort);
                dockerPortExists.should.be.true;
                createdVM.VMName.should.equal(vmName);
                vmToUse.Name = vmName;
                vmToUse.Created = true;
                vmToUse.Delete = true;
                setTimeout(done, timeout);
              });
            });
          });
        });
      });

      it('Create Docker VM with custom values should pass', function (done) {
        dockerCertDir = path.join(homePath, '.docker2');
        var dockerPort = 4113;

        vmUtility.getImageName('Linux', function (ImageName) {
          var cmd = util.format('vm docker create %s %s %s %s --json --ssh --docker-cert-dir %s --docker-port %s',
              vmName, ImageName, username, password, dockerCertDir, dockerPort).split(' ');
          cmd.push('--location');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.equal(0);
            cmd = util.format('vm show %s --json', vmName).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function (result) {
              result.exitStatus.should.equal(0);
              var certificatesExist = checkForDockerCertificates(dockerCertDir);
              certificatesExist.should.be.true;
              var createdVM = JSON.parse(result.text);
              var dockerPortExists = checkForDockerPort(createdVM, dockerPort);
              dockerPortExists.should.be.true;
              createdVM.VMName.should.equal(vmName);
              vmToUse.Name = vmName;
              vmToUse.Created = true;
              vmToUse.Delete = true;
              setTimeout(done, timeout);
            });
          });
        });
      });

      it('Create Docker VM with duplicate docker port should throw error', function (done) {
        vmUtility.getImageName('Linux', function (ImageName) {
          var cmd = util.format('vm docker create %s %s %s %s --json --ssh 22 --docker-port 22',
              vmName, ImageName, username, password).split(' ');
          cmd.push('--location');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.not.equal(0);
            result.errorText.should.include('Port 22 is already in use by one of the endpoints in this deployment');
            setTimeout(done, timeout);
          });
        });
      });

      it('Create Docker VM with invalid docker port should throw error', function (done) {
        vmUtility.getImageName('Linux', function (ImageName) {
          var cmd = util.format('vm docker create %s %s %s %s --json --ssh 22 --docker-port 3.2',
              vmName, ImageName, username, password).split(' ');
          cmd.push('--location');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.not.equal(0);
            result.errorText.should.include('A parameter was incorrect');
            setTimeout(done, timeout);
          });
        });
      });

      it('Create Docker VM with invalid docker cert dir should throw error', function (done) {
        vmUtility.getImageName('Linux', function (ImageName) {
          var cmd = util.format('vm docker create %s %s %s %s --json --ssh 22 --docker-cert-dir D:/foo/bar',
              vmName, ImageName, username, password).split(' ');
          cmd.push('--location');
          cmd.push(location);
          testUtils.executeCommand(suite, retry, cmd, function (result) {
            result.exitStatus.should.not.equal(0);
            result.errorText.should.include('ENOENT');
            setTimeout(done, timeout);
          });
        });
      });
    });

    function checkForDockerPort(createdVM, dockerPort) {
      var result = false;
      if (createdVM.Network && createdVM.Network.Endpoints) {
        createdVM.Network.Endpoints.forEach(function (element, index, array) {
          if (element.name === 'docker' && element.port === dockerPort) {
            result = true;
          }
        });
      }
      return result;
    }

    function checkForDockerCertificates(dockerCertDir, cb) {
      dockerCerts = {
        caKey : path.join(dockerCertDir, 'ca-key.pem'),
        ca : path.join(dockerCertDir, 'ca.pem'),
        serverKey : path.join(dockerCertDir, 'server-key.pem'),
        server : path.join(dockerCertDir, 'server.csr'),
        serverCert : path.join(dockerCertDir, 'server-cert.pem'),
        clientKey : path.join(dockerCertDir, 'key.pem'),
        client : path.join(dockerCertDir, 'client.csr'),
        clientCert : path.join(dockerCertDir, 'cert.pem'),
        extfile : path.join(dockerCertDir, 'extfile.cnf')
      };

      if (!fs.existsSync(dockerCerts.caKey)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.ca)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.serverKey)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.server)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.serverCert)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.clientKey)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.client)) {
        return false;
      }

      if (!fs.existsSync(dockerCerts.clientCert)) {
        return false;
      }

      return true;
    }

    function createReservedIp(location, callback) {
      if (createReservedIp.ripName) {
        callback(createReservedIp.ripName);
      } else {
        var cmd;
        cmd = util.format('network reserved-ip list --json').split(' ');
        testUtils.executeCommand(suite, retry, cmd, function (result) {
          result.exitStatus.should.equal(0);
          var ripList = JSON.parse(result.text);
          var ripfound = ripList.some(function (ripObj) {
              if (!ripObj.inUse && ripObj.location.toLowerCase() === location.toLowerCase()) {
                createReservedIp.ripName = ripObj.name;
                return true;
              }
            });
          if (ripfound) {
            callback(createReservedIp.ripName);
          } else {
            cmd = util.format('network reserved-ip create %s %s --json', ripName, location).split(' ');
            testUtils.executeCommand(suite, retry, cmd, function (result) {
              result.exitStatus.should.equal(0);
              ripCreate = true;
              createReservedIp.ripName = ripObj.name;
              callback(createReservedIp.ripName);
            });
          }
        });
      }
    }

    function deleterip(callback) {
      var cmd = util.format('network reserved-ip delete %s -q --json', ripName).split(' ');
      testUtils.executeCommand(suite, retry, cmd, function (result) {
        result.exitStatus.should.equal(0);
        ripCreate = false;
        callback();
      });
    }
  });
});