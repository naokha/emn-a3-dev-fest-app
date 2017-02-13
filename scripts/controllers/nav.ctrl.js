(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('NavCtrl',
            function($scope,
                $state,
                $rootScope) {
                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $('.button-collapse').sideNav({ // enable side bar nav
                        menuWidth: 300, // Default is 300
                        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                        draggable: true // Choose whether you can drag to open on touch screens
                    });
                    $scope.showBackButton = false;
                    // the available views in the app, key are the routes
                    $scope.views = {
                        "conference": {
                            "name": "Conférence"
                        },
                        "sessions": {
                            "name": "Session"
                        },
                        "presenters": {
                            "name": "Présentateurs"
                        },
                        "about_phone": {
                            "name": "Téléphone"
                        }
                    }
                    setCurrentView('conference');
                };

                // go back in history on click on the back button
                $scope.goBack = function() {
                    $scope.showBackButton = false;
                    window.history.back();
                }

                // change route and update the view name accordingly
                $scope.changeView = function(route) {
                    setCurrentView(route);
                    $state.go(route);
                };

                // updat the currently displayed view in the menu
                function setCurrentView(route) {
                    $scope.currentView = $scope.views[route].name;
                }
                // display back button when we're in a child state (session detail or presenter detail)
                $rootScope.$on('inChildState', function() {
                    $scope.showBackButton = true;
                });

                // Update view in the nav bar when the route changes
                $scope.$on('$stateChangeStart', function(event, next, current) {
                    if ($scope.views[next.name]) {
                        setCurrentView(next.name);
                        $scope.showBackButton = false;
                    }
                });
                $scope.init();
            });
})();
