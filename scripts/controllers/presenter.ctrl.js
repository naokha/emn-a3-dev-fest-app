(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('PresenterCtrl', ['$scope', '$stateParams', '$rootScope', '$cordovaContacts', 'presenter', 'presenterSessions', 'ContactsFactory', 'InAppBrowserFactory',
            function($scope, $stateParams, $rootScope, $cordovaContacts, presenter, presenterSessions, ContactsFactory, InAppBrowserFactory) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $rootScope.$emit('inChildState'); // indicate to the nav ctrl that we are in child state to display back button
                    $scope.presenterId = $stateParams.presenterId;
                    $scope.presenterSessions = presenterSessions;
                    $scope.presenter = presenter;
                    $scope.presenterFullName = $scope.presenter.firstname + " " + $scope.presenter.lastname;
                    $scope.isInContacts = false;
                    $scope.contact = null;
                    ContactsFactory.findContact(presenter.firstname, presenter.lastname).then(function(res) {
                        if (res.length > 0) {
                            $scope.isInContacts = true;
                            $scope.contact = res[0];
                        }
                    })
                }

                $scope.openInBrowser = InAppBrowserFactory.openLink;

                $scope.handleContactChanged = function() {
                    if ($scope.isInContacts) {
                        saveContact();
                    } else {
                        deleteContact();
                    }
                }

                function saveContact() {
                    ContactsFactory.createContact($scope.presenter).then(function() {
                        Materialize.toast($scope.presenterFullName + " a été ajouté à vos contacts", 4000, 'green');
                    }, function(err) {
                        $scope.isInContacts = false; // set back to false to reflect reality
                        Materialize.toast($scope.presenterFullName + " n'a pas pu être ajouté à vos contacts", 4000, 'red');
                    });
                }

                function deleteContact() {
                    $cordovaContacts.remove($scope.contact).then(function() {
                        Materialize.toast($scope.presenterFullName + " a été supprimé de vos contacts", 4000, 'green');
                    }, function(err) {
                        $scope.isInContacts = true; // set back to true to reflect reality
                        Materialize.toast($scope.presenterFullName + " n'a pas été supprimé de vos contacts", 4000, 'red');
                    });
                }
                $scope.init();
            }
        ]);
})();
