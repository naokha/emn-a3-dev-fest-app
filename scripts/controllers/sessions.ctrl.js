(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('SessionsCtrl',
            function($scope,
                sessions) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $scope.sessions = sessions;
                }
                $scope.init();
            }
        );
})();
