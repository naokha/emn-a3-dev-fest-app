(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('SessionCtrl', ['$scope', '$stateParams', '$rootScope', '$state', 'session', 'sessionPresenters',
            function($scope, $stateParams, $rootScope, $state, session, sessionPresenters) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $rootScope.$emit('inChildState'); // indicate to the nav ctrl that we are in child state to display back button
                    $scope.sessionId = $stateParams.sessionId;
                    $scope.session = session;
                    $scope.sessionPresenters = sessionPresenters;
                }

                // go to the detail of the presenter
                $scope.seePresenter = function(presenterId) {
                    $state.go('presenters-detail', {'presenterId': presenterId});
                }

                $scope.init();
            }
        ]);
})();
