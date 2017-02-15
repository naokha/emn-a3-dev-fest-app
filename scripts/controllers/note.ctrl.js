(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('NoteCtrl',
            function($scope, session, $stateParams, SessionNotesFactory, $rootScope, $state, note, pictures, videos, audios, DialogFactory) {

                $scope.init = function() {
                    $rootScope.$emit('inChildState'); // indicate to the nav ctrl that we are in child state to display back button
                    $scope.sessionId = $stateParams.sessionId;
                    $scope.session = session;
                    $scope.noteId = $stateParams.noteId;
                    $scope.note = note;
                    $scope.mode = $stateParams.mode;;
                    $scope.pictures = pictures;
                    $scope.newPictures = [];
                    $scope.audios = audios;
                    $scope.newAudios = [];
                    $scope.videos = videos;
                    $scope.newVideos = [];
                    makeNoteCopy(); // create a copy of the note to know if any note's attribute changed
                };
                $scope.updateNote = function() {
                    if ($scope.noteChanged()) {
                        var queryFn;
                        var message;
                        if ($scope.mode === 'create') {
                            queryFn = SessionNotesFactory.addNote;
                            message = 'créée';
                        } else {
                            queryFn = SessionNotesFactory.updateNote;
                            message = 'mise à jour';
                        }
                        queryFn($scope.note, $scope.newPictures, $scope.newVideos, $scope.newAudios).then(function(res) {
                            updateMediasIds(res[1], res[2], res[3]);
                            $scope.mode = 'edit'; // ensure we pass in edit mode if we were in create mode
                            makeNoteCopy(); // actualize savedNote
                            resetMedia();
                            DialogFactory.showSuccessDialog('La note a bien été ' + message);
                        }, function(err) {
                            DialogFactory.showErrorDialog('Erreur, la note n\'a pas pu être ' + message);
                        });
                    }

                };

                function updateMediasIds(updatedPictures, updatedVideos, updatedAudios) {
                    for (var i in $scope.newPictures) {
                        $scope.pictures[$scope.pictures.indexOf($scope.newPictures[i])].id = updatedPictures[i].insertId;
                    }
                    for (var i in $scope.newVideos) {
                        $scope.videos[$scope.videos.indexOf($scope.newVideos[i])].id = updatedVideos[i].insertId;
                    }
                    for (var i in $scope.newAudios) {
                        $scope.audios.indexOf($scope.newAudios[i]);
                        $scope.audios[$scope.audios.indexOf($scope.newAudios[i])].id = updatedAudios[i].insertId;
                    }
                };

                function makeNoteCopy() {
                    $scope.savedNote = angular.copy($scope.note);
                };

                function resetMedia() {
                    $scope.newPictures = [];
                    $scope.newVideos = [];
                    $scope.newAudios = [];
                };

                $scope.deleteNote = function() {
                    SessionNotesFactory.deleteNote($scope.noteId).then(function(res) {
                        DialogFactory.showSuccessDialog('La note a bien été supprimée');
                        $state.go("sessions-detail-notes", { 'sessionId': $scope.sessionId }, { location: "replace", reload: true });
                    }, function(err) {
                        DialogFactory.showErrorDialog('Erreur, la note n\'a pas été supprimée');
                    });
                };

                // to check if the title or comment of the note changed
                $scope.noteChanged = function() {
                    return $scope.note.title !== $scope.savedNote.title || $scope.note.comment !== $scope.savedNote.comment || $scope.newPictures.length > 0 || $scope.newVideos.length > 0 || $scope.newAudios.length > 0;
                };

                $scope.init();
            });
})();
