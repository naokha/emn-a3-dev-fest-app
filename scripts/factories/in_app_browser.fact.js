(function() {
    'use strict';
    angular.module('app').factory("InAppBrowserFactory",
        function($cordovaInAppBrowser) {
            var options = {
                location: 'no',
                clearcache: 'yes',
                toolbar: 'no'
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
