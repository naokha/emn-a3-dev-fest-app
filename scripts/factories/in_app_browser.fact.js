(function() {
    'use strict';
    angular.module('app').factory("InAppBrowserFactory",
        function($cordovaInAppBrowser) {
            var options = {
                location: 'yes',
                clearcache: 'no',
                toolbar: 'yes'
            };
            var self = {
                openLink: function(link) {
                    $cordovaInAppBrowser.open(link, '_blank', options)
                        .then(function(event) {
                            // success
                        })
                        .catch(function(event) {
                            // error
                        });
                }
            };
            return self;
        }
    );
})();
