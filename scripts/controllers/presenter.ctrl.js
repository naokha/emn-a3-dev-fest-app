(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('PresenterCtrl',
            function($scope,
                $stateParams,
                $rootScope,
                $cordovaContacts,
                presenter,
                presenterSessions,
                ContactsFactory,
                InAppBrowserFactory,
                DialogFactory) {

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
                    $scope.contact = null;
                    ContactsFactory.findContact(presenter.firstname, presenter.lastname).then(function(res) {
                        if (res.length > 0) {
                            $scope.isInContacts = true;
                            $scope.contact = res[0];
                        } else {
                            $scope.isInContacts = false;
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
                        DialogFactory.showSuccessDialog($scope.presenterFullName + " a été ajouté à vos contacts");
                    }, function(err) {
                        $scope.isInContacts = false; // set back to false to reflect reality
                        DialogFactory.showErrorDialog("Erreur, " + $scope.presenterFullName + " n'a pas pu être ajouté à vos contacts");
                    });
                }

                function deleteContact() {
                    $cordovaContacts.remove($scope.contact).then(function() {
                        DialogFactory.showSuccessDialog($scope.presenterFullName + " a été supprimé de vos contacts");
                    }, function(err) {
                        $scope.isInContacts = true; // set back to true to reflect reality
                        DialogFactory.showErrorDialog("Erreur, " + $scope.presenterFullName + " n'a pas pu être supprimé de vos contacts");
                    });
                }
                $scope.init();
            });
})();
