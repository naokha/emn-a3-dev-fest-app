(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('NotesCtrl',
            function($scope,
                session,
                $stateParams,
                notes,
                $rootScope) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $rootScope.$emit('inChildState'); // indicate to the nav ctrl that we are in child state to display back button
                    $scope.sessionId = $stateParams.sessionId;
                    $scope.notes = notes;
                    $scope.session = session;
                }
                $scope.init();
            }
        );
})();
