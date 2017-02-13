(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('PresentersCtrl',
            function($scope,
                presenters) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $scope.presenters = presenters;
                }
                $scope.init();
            }
        );
})();
