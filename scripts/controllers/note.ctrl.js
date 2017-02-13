(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('NoteCtrl',
            function($scope,
                $stateParams,
                SessionNotesFactory,
                NotePicturesFactory,
                $rootScope,
                $state,
                note,
                $cordovaCamera,
                pictures,
                $cordovaCapture,
                videos,
                audios) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $rootScope.$emit('inChildState'); // indicate to the nav ctrl that we are in child state to display back button
                    $scope.sessionId = $stateParams.sessionId;
                    $scope.noteId = $stateParams.noteId;
                    $scope.note = note;
                    $scope.mode = $stateParams.mode;;
                    $scope.savedNote = angular.copy($scope.note); // keep a copy of the note for change checking
                    $scope.imgSrc = "";
                    $scope.pictures = pictures;
                    $scope.newPictures = [];
                    $scope.audios = audios;
                    $scope.newAudios = [];
                    $scope.videos = videos;
                    $scope.newVideos = [];
                    $scope.picOptions = {
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 100,
                        targetHeight: 100,
                        saveToPhotoAlbum: false,
                        correctOrientation: true
                    };
                };

                $scope.updateNote = function() {
                    if ($scope.noteChanged()) {
                        if ($scope.mode === 'create') {
                            SessionNotesFactory.addNote($scope.note.title, $scope.note.comment, $scope.sessionId, $scope.newPictures, $scope.newVideos, $scope.newAudios).then(function(res) {
                                resetMedia();
                                Materialize.toast('La note a bien été créée', 4000, 'green');
                                $scope.mode = 'edit'; // we pass in edit mode to allow deletion                           
                            }, function() {
                                Materialize.toast('Erreur, la note n\'a pas pu être créée', 4000, 'red');
                            });
                        } else {
                            SessionNotesFactory.updateNote($scope.note.id, $scope.note.title, $scope.note.comment, $scope.newPictures, $scope.newVideos, $scope.newAudios).then(function() {
                                resetMedia();
                                Materialize.toast('La note a bien été mise à jour', 4000, 'green');
                            }, function() {
                                Materialize.toast('Erreur, la note n\'a pas pu être mise à jour', 4000, 'red');
                            });
                        }
                    }

                };

                function resetMedia(){
                    $scope.newPictures = [];
                    $scope.newVideos = [];
                    $scope.newAudios = [];
                }
                $scope.takeAudio = function() {
                    var options = { limit: 3, duration: 10 };
                    $cordovaCapture.captureAudio(options).then(function(audioData) {
                        var newAudio = {
                            "audio": audioData[0].fullPath
                        };
                        $scope.newAudios.push(newAudio);
                        $scope.audios.push(newAudio);
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });
                }

                $scope.takeVideo = function() {
                    var options = { limit: 3, duration: 15 };
                    $cordovaCapture.captureVideo(options).then(function(videoData) {
                        var newVideo = {
                            "video": videoData[0].fullPath
                        };
                        $scope.newVideos.push(newVideo);
                        $scope.videos.push(newVideo);
                    }, function(err) {});
                }

                $scope.takePictureWithCamera = function() {
                    var options = $scope.picOptions;
                    options.sourceType = Camera.PictureSourceType.CAMERA;
                    takePicture(options);
                }

                $scope.takePictureFromLibrary = function() {
                    var options = $scope.picOptions;
                    options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                    takePicture(options);
                }

                function takePicture(options) {
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        var pictureSrc = "data:image/jpeg;base64," + imageData;
                        var newPicture = {
                            "picture": pictureSrc
                        };
                        $scope.pictures.push(newPicture);
                        $scope.newPictures.push(newPicture);
                    }, function(err) {});
                }


                $scope.deleteNote = function() {
                    SessionNotesFactory.deleteNote($scope.noteId).then(function(res) {
                        Materialize.toast('La note a bien été supprimée', 4000, 'green');
                        $state.go("sessions-detail-notes", { 'sessionId': $scope.sessionId }, { location: "replace", reload: true });
                    }, function(err) {
                        Materialize.toast('Erreur, la note n\'a pas été supprimée', 4000, 'red');
                    });
                };

                // to check if the title or comment of the note changed
                $scope.noteChanged = function() {
                    return $scope.note.title !== $scope.savedNote.title || $scope.note.comment !== $scope.savedNote.comment || $scope.newPictures.length > 0 || $scope.newVideos.length > 0
                }

                $scope.init();
            }
        );
})();
