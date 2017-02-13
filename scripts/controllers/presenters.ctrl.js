(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('PresentersCtrl', ['$scope', 'presenters',
            function($scope, presenters) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $scope.presenters = presenters;
                }
                $scope.init();
            }
        ]);
})();
