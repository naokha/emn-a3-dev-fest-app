(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('AboutPhoneCtrl',
            function($scope,
                $cordovaDevice,
                $cordovaNetwork,
                InAppBrowserFactory) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $scope.platform = $cordovaDevice.getPlatform();
                    $scope.version = $cordovaDevice.getVersion();
                    $scope.uuid = $cordovaDevice.getUUID();
                    $scope.model = $cordovaDevice.getModel();
                    $scope.connection = $cordovaNetwork.getNetwork();
                }

                $scope.openInBrowser = InAppBrowserFactory.openLink;
                $scope.init();
            });
})();
