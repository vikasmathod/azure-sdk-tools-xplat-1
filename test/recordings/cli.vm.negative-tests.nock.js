// This file has been autogenerated.
var profile = require('../../lib/util/profile');
exports.getMockedProfile = function () {
  var newProfile = new profile.Profile();

  newProfile.addSubscription(new profile.Subscription({
      id : 'db1ab6f0-4769-4b27-930e-01e2ef9c123c',
      managementCertificate : {
        key : 'mockedKey',
        cert : 'mockedCert'
      },
      name : 'Azure SDK sandbox',
      username : 'user@domain.example',
      registeredProviders : ['website', 'sqlserver'],
      registeredResourceNamespaces : [],
      isDefault : true
    }, newProfile.environments['AzureCloud']));

  return newProfile;
};
exports.setEnvironment = function () {
  process.env['AZURE_VM_TEST_LOCATION'] = 'West US';
}

exports.scopes = [
  // Negative Test Case by specifying invalid Password
  [

    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/images')
        .reply(200, "<Images xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><OSImage><Category>Public</Category><Label>RightImage CentOS 6.2 x64 v5.8.8.1</Label><Location>West US;East Asia;Southeast Asia;North Europe;West Europe;East US</Location><LogicalSizeInGB>10</LogicalSizeInGB><Name>0b11de9248dd4d87b18621318e037d37__RightImage-CentOS-6.2-x64-v5.8.8.1</Name><OS>Linux</OS><Eula>http://support.rightscale.com/12-Guides/RightLink/RightLink_End_User_License_Agreeement</Eula><Description>CentOS 6.3 with RightLink 5.8.</Description><ImageFamily>RightScale Linux v13</ImageFamily><ShowInGui>false</ShowInGui><PublishedDate>2012-08-28T00:00:00Z</PublishedDate><IsPremium>false</IsPremium><PrivacyUri>http://www.rightscale.com/privacy_policy.php</PrivacyUri><PublisherName>RightScale with Linux</PublisherName></OSImage></Images>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
	function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/vmimages')
        .reply(200, "<VMImages xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><VMImage><Name>nerdworksub1-20140716-893917</Name><Label>nerdworks-ubuntu-image1</Label><Category>User</Category><OSDiskConfiguration><Name>nerdworksub1-20140716-893917-os-2014-07-17</Name><HostCaching>ReadWrite</HostCaching><OSState>Specialized</OSState><OS>Linux</OS><MediaLink>https://acsforsdk2.blob.core.windows.net/vhd-store/nerdworksub1-20140716-893917-os-2014-07-17.vhd</MediaLink><LogicalDiskSizeInGB>30</LogicalDiskSizeInGB></OSDiskConfiguration><DataDiskConfigurations/><ServiceName>nerdworksub1</ServiceName><DeploymentName>nerdworksub1</DeploymentName><RoleName>nerdworksub1</RoleName><Location>West US</Location><CreatedTime>2014-07-17T04:48:06.0038647Z</CreatedTime><ModifiedTime>2014-07-17T04:48:06.0038647Z</ModifiedTime><IsPremium>false</IsPremium></VMImage></VMImages>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/images')
        .reply(200, "<Images xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><OSImage><Category>Public</Category><Label>RightImage CentOS 6.2 x64 v5.8.8.1</Label><Location>West US;East Asia;Southeast Asia;North Europe;West Europe;East US</Location><LogicalSizeInGB>10</LogicalSizeInGB><Name>0b11de9248dd4d87b18621318e037d37__RightImage-CentOS-6.2-x64-v5.8.8.1</Name><OS>Linux</OS><Eula>http://support.rightscale.com/12-Guides/RightLink/RightLink_End_User_License_Agreeement</Eula><Description>CentOS 6.3 with RightLink 5.8.</Description><ImageFamily>RightScale Linux v13</ImageFamily><ShowInGui>false</ShowInGui><PublishedDate>2012-08-28T00:00:00Z</PublishedDate><IsPremium>false</IsPremium><PrivacyUri>http://www.rightscale.com/privacy_policy.php</PrivacyUri><PublisherName>RightScale with Linux</PublisherName></OSImage></Images>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
	function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/vmimages')
        .reply(200, "<VMImages xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><VMImage><Name>nerdworksub1-20140716-893917</Name><Label>nerdworks-ubuntu-image1</Label><Category>User</Category><OSDiskConfiguration><Name>nerdworksub1-20140716-893917-os-2014-07-17</Name><HostCaching>ReadWrite</HostCaching><OSState>Specialized</OSState><OS>Linux</OS><MediaLink>https://acsforsdk2.blob.core.windows.net/vhd-store/nerdworksub1-20140716-893917-os-2014-07-17.vhd</MediaLink><LogicalDiskSizeInGB>30</LogicalDiskSizeInGB></OSDiskConfiguration><DataDiskConfigurations/><ServiceName>nerdworksub1</ServiceName><DeploymentName>nerdworksub1</DeploymentName><RoleName>nerdworksub1</RoleName><Location>West US</Location><CreatedTime>2014-07-17T04:48:06.0038647Z</CreatedTime><ModifiedTime>2014-07-17T04:48:06.0038647Z</ModifiedTime><IsPremium>false</IsPremium></VMImage></VMImages>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    }
  ],
  /*negetive_createVM_Invalid_name*/
  [

    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/images')
        .reply(200, "<Images xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><OSImage><Category>Public</Category><Label>RightImage CentOS 6.2 x64 v5.8.8.1</Label><Location>West US;East Asia;Southeast Asia;North Europe;West Europe;East US</Location><LogicalSizeInGB>10</LogicalSizeInGB><Name>0b11de9248dd4d87b18621318e037d37__RightImage-CentOS-6.2-x64-v5.8.8.1</Name><OS>Linux</OS><Eula>http://support.rightscale.com/12-Guides/RightLink/RightLink_End_User_License_Agreeement</Eula><Description>CentOS 6.3 with RightLink 5.8.</Description><ImageFamily>RightScale Linux v13</ImageFamily><ShowInGui>false</ShowInGui><PublishedDate>2012-08-28T00:00:00Z</PublishedDate><IsPremium>false</IsPremium><PrivacyUri>http://www.rightscale.com/privacy_policy.php</PrivacyUri><PublisherName>RightScale with Linux</PublisherName></OSImage></Images>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
	function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/vmimages')
        .reply(200, "<VMImages xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><VMImage><Name>nerdworksub1-20140716-893917</Name><Label>nerdworks-ubuntu-image1</Label><Category>User</Category><OSDiskConfiguration><Name>nerdworksub1-20140716-893917-os-2014-07-17</Name><HostCaching>ReadWrite</HostCaching><OSState>Specialized</OSState><OS>Linux</OS><MediaLink>https://acsforsdk2.blob.core.windows.net/vhd-store/nerdworksub1-20140716-893917-os-2014-07-17.vhd</MediaLink><LogicalDiskSizeInGB>30</LogicalDiskSizeInGB></OSDiskConfiguration><DataDiskConfigurations/><ServiceName>nerdworksub1</ServiceName><DeploymentName>nerdworksub1</DeploymentName><RoleName>nerdworksub1</RoleName><Location>West US</Location><CreatedTime>2014-07-17T04:48:06.0038647Z</CreatedTime><ModifiedTime>2014-07-17T04:48:06.0038647Z</ModifiedTime><IsPremium>false</IsPremium></VMImage></VMImages>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/hostedservices')
        .reply(200, "<HostedServices xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><HostedService><Url>https://management.core.windows.net/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/services/hostedservices/xplattestvm</Url><ServiceName>xplattestvm</ServiceName><HostedServiceProperties><Description>Implicitly created hosted service</Description><Location>West US</Location><Label>eHBsYXR0ZXN0dm0=</Label><Status>Created</Status><DateCreated>2013-11-22T05:21:47Z</DateCreated><DateLastModified>2013-11-22T05:22:06Z</DateLastModified><ExtendedProperties/></HostedServiceProperties></HostedService></HostedServices>", {
          'cache-control' : 'no-cache',
          'content-length' : '4051',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '5d885d0c15de3972b157f08150763761',
          date : 'Fri, 22 Nov 2013 05:21:37 GMT'
        });
      return result;
    },
    function (nock) {
      var result =
        nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/locations')
        .reply(200, "<Locations xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><Location><Name>East Asia</Name><DisplayName>East Asia</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>Southeast Asia</Name><DisplayName>Southeast Asia</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>North Europe</Name><DisplayName>North Europe</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>West Europe</Name><DisplayName>West Europe</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>East US</Name><DisplayName>East US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>North Central US</Name><DisplayName>North Central US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService></AvailableServices></Location><Location><Name>South Central US</Name><DisplayName>South Central US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService></AvailableServices></Location><Location><Name>West US</Name><DisplayName>West US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location></Locations>", {
          'cache-control' : 'no-cache',
          'content-length' : '2413',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : 'c6b61dd1e42a3581b07792eb93a77d35',
          date : 'Thu, 21 Nov 2013 13:48:36 GMT'
        });
      return result;
    },
    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .filteringRequestBody(function (path) {
          return '*';
        })
        .post('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/hostedservices', "*")
        .reply(400, "<Error xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><Code>BadRequest</Code><Message>The hosted service name is invalid.</Message></Error>", {
          'cache-control' : 'no-cache',
          'content-length' : '194',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.27 (rd_rdfe_stable.131122-1638) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '68b8eaab6baa3796b8a419d9738dbbae',
          date : 'Mon, 25 Nov 2013 11:50:14 GMT'
        });
      return result;
    }
  ],

  /*negetive_invalid_location*/
  [

    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/images')
        .reply(200, "<Images xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><OSImage><Category>Public</Category><Label>RightImage CentOS 6.2 x64 v5.8.8.1</Label><Location>West US;East Asia;Southeast Asia;North Europe;West Europe;East US</Location><LogicalSizeInGB>10</LogicalSizeInGB><Name>0b11de9248dd4d87b18621318e037d37__RightImage-CentOS-6.2-x64-v5.8.8.1</Name><OS>Linux</OS><Eula>http://support.rightscale.com/12-Guides/RightLink/RightLink_End_User_License_Agreeement</Eula><Description>CentOS 6.3 with RightLink 5.8.</Description><ImageFamily>RightScale Linux v13</ImageFamily><ShowInGui>false</ShowInGui><PublishedDate>2012-08-28T00:00:00Z</PublishedDate><IsPremium>false</IsPremium><PrivacyUri>http://www.rightscale.com/privacy_policy.php</PrivacyUri><PublisherName>RightScale with Linux</PublisherName></OSImage></Images>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
	function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/vmimages')
        .reply(200, "<VMImages xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><VMImage><Name>nerdworksub1-20140716-893917</Name><Label>nerdworks-ubuntu-image1</Label><Category>User</Category><OSDiskConfiguration><Name>nerdworksub1-20140716-893917-os-2014-07-17</Name><HostCaching>ReadWrite</HostCaching><OSState>Specialized</OSState><OS>Linux</OS><MediaLink>https://acsforsdk2.blob.core.windows.net/vhd-store/nerdworksub1-20140716-893917-os-2014-07-17.vhd</MediaLink><LogicalDiskSizeInGB>30</LogicalDiskSizeInGB></OSDiskConfiguration><DataDiskConfigurations/><ServiceName>nerdworksub1</ServiceName><DeploymentName>nerdworksub1</DeploymentName><RoleName>nerdworksub1</RoleName><Location>West US</Location><CreatedTime>2014-07-17T04:48:06.0038647Z</CreatedTime><ModifiedTime>2014-07-17T04:48:06.0038647Z</ModifiedTime><IsPremium>false</IsPremium></VMImage></VMImages>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/images')
        .reply(200, "<Images xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><OSImage><Category>Public</Category><Label>RightImage CentOS 6.2 x64 v5.8.8.1</Label><Location>West US;East Asia;Southeast Asia;North Europe;West Europe;East US</Location><LogicalSizeInGB>10</LogicalSizeInGB><Name>0b11de9248dd4d87b18621318e037d37__RightImage-CentOS-6.2-x64-v5.8.8.1</Name><OS>Linux</OS><Eula>http://support.rightscale.com/12-Guides/RightLink/RightLink_End_User_License_Agreeement</Eula><Description>CentOS 6.3 with RightLink 5.8.</Description><ImageFamily>RightScale Linux v13</ImageFamily><ShowInGui>false</ShowInGui><PublishedDate>2012-08-28T00:00:00Z</PublishedDate><IsPremium>false</IsPremium><PrivacyUri>http://www.rightscale.com/privacy_policy.php</PrivacyUri><PublisherName>RightScale with Linux</PublisherName></OSImage></Images>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
	function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/vmimages')
        .reply(200, "<VMImages xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><VMImage><Name>nerdworksub1-20140716-893917</Name><Label>nerdworks-ubuntu-image1</Label><Category>User</Category><OSDiskConfiguration><Name>nerdworksub1-20140716-893917-os-2014-07-17</Name><HostCaching>ReadWrite</HostCaching><OSState>Specialized</OSState><OS>Linux</OS><MediaLink>https://acsforsdk2.blob.core.windows.net/vhd-store/nerdworksub1-20140716-893917-os-2014-07-17.vhd</MediaLink><LogicalDiskSizeInGB>30</LogicalDiskSizeInGB></OSDiskConfiguration><DataDiskConfigurations/><ServiceName>nerdworksub1</ServiceName><DeploymentName>nerdworksub1</DeploymentName><RoleName>nerdworksub1</RoleName><Location>West US</Location><CreatedTime>2014-07-17T04:48:06.0038647Z</CreatedTime><ModifiedTime>2014-07-17T04:48:06.0038647Z</ModifiedTime><IsPremium>false</IsPremium></VMImage></VMImages>", {
          'cache-control' : 'no-cache',
          'content-length' : '183188',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '3c1093e5080635829fc5aeffaaedbc47',
          date : 'Fri, 22 Nov 2013 05:21:34 GMT'
        });
      return result;
    },
    function (nock) {
      var result = nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/services/hostedservices')
        .reply(200, "<HostedServices xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><HostedService><Url>https://management.core.windows.net/bfb5e0bf-124b-4d0c-9352-7c0a9f4d9948/services/hostedservices/xplattestvm</Url><ServiceName>xplattestvm</ServiceName><HostedServiceProperties><Description>Implicitly created hosted service</Description><Location>West US</Location><Label>eHBsYXR0ZXN0dm0=</Label><Status>Created</Status><DateCreated>2013-11-22T05:21:47Z</DateCreated><DateLastModified>2013-11-22T05:22:06Z</DateLastModified><ExtendedProperties/></HostedServiceProperties></HostedService></HostedServices>", {
          'cache-control' : 'no-cache',
          'content-length' : '4051',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : '5d885d0c15de3972b157f08150763761',
          date : 'Fri, 22 Nov 2013 05:21:37 GMT'
        });
      return result;
    },
    function (nock) {
      var result =
        nock('https://management.core.windows.net:443')
        .get('/db1ab6f0-4769-4b27-930e-01e2ef9c123c/locations')
        .reply(200, "<Locations xmlns=\"http://schemas.microsoft.com/windowsazure\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><Location><Name>East Asia</Name><DisplayName>East Asia</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>Southeast Asia</Name><DisplayName>Southeast Asia</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>North Europe</Name><DisplayName>North Europe</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>West Europe</Name><DisplayName>West Europe</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>East US</Name><DisplayName>East US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location><Location><Name>North Central US</Name><DisplayName>North Central US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService></AvailableServices></Location><Location><Name>South Central US</Name><DisplayName>South Central US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService></AvailableServices></Location><Location><Name>West US</Name><DisplayName>West US</DisplayName><AvailableServices><AvailableService>Compute</AvailableService><AvailableService>Storage</AvailableService><AvailableService>PersistentVMRole</AvailableService><AvailableService>HighMemory</AvailableService></AvailableServices></Location></Locations>", {
          'cache-control' : 'no-cache',
          'content-length' : '2413',
          'content-type' : 'application/xml; charset=utf-8',
          server : '1.0.6198.25 (rd_rdfe_stable.131118-1436) Microsoft-HTTPAPI/2.0',
          'x-ms-servedbyregion' : 'ussouth',
          'x-ms-request-id' : 'c6b61dd1e42a3581b07792eb93a77d35',
          date : 'Thu, 21 Nov 2013 13:48:36 GMT'
        });
      return result;
    }
  ]
]