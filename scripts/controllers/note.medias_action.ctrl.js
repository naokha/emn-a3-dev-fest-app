(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('MediasActionCtrl',
            function($scope, DialogFactory, $cordovaActionSheet, $cordovaSocialSharing, $q, NoteVideosFactory, NoteAudiosFactory, NotePicturesFactory) {
                $scope.showVideoActionSheet = function(video, $event) {
                    var options = {
                        title: 'Que faire avec la vidéo ?',
                        buttonLabels: ['Lire', 'Pause', 'Supprimer'],
                        addCancelButtonWithLabel: 'Annuler',
                        androidEnableCancelButton: true,
                        winphoneEnableCancelButton: true
                    };
                    $cordovaActionSheet.show(options).then(function(btnIndex) {
                        var videoElem = $event.target;
                        if (btnIndex === 1) {
                            videoElem.play();
                        } else if (btnIndex === 2) {
                            videoElem.pause();
                        } else if (btnIndex === 3) { // delete video
                            var promise;
                            if (video.id) {
                                promise = NoteVideosFactory.deleteVideo(video.id);
                            } else {
                                promise = $q.when(); // empty promise
                            }
                            promise.then(function() {
                                deleteLocalVideo(video);
                            }, function(err) { // err can only happen if image was in DB
                                DialogFactory.showErrorDialog('Erreur, impossible de supprimer la vidéo');
                            })
                        }
                    });
                };

                $scope.showAudioActionSheet = function(audio, $event) {
                    var options = {
                        title: 'Que faire avec la capture de son ?',
                        buttonLabels: ['Lire', 'Pause', 'Supprimer'],
                        addCancelButtonWithLabel: 'Annuler',
                        androidEnableCancelButton: true,
                        winphoneEnableCancelButton: true,
                    };
                    $cordovaActionSheet.show(options).then(function(btnIndex) {
                        var audioElem = angular.element($event.target).siblings()[0];
                        if (btnIndex === 1) {
                            audioElem.play();
                        } else if (btnIndex === 2) {
                            audioElem.pause();
                        } else if (btnIndex === 3) { // delete audio
                            var promise;
                            if (audio.id) {
                                promise = NoteAudiosFactory.deleteAudio(audio.id);
                            } else {
                                promise = $q.when(); // empty promise
                            }
                            promise.then(function(res) {
                                deleteLocalAudio(audio);
                            }, function(err) { // err can only happen if image was in DB
                                DialogFactory.showErrorDialog('Erreur, impossible de supprimer la capture de son');
                            })
                        }
                    });
                };

                $scope.showImageActionSheet = function(picture) {
                    var options = {
                        title: 'Que faire avec l\'image ?',
                        buttonLabels: ['Supprimer', 'Partager'],
                        addCancelButtonWithLabel: 'Annuler',
                        androidEnableCancelButton: true,
                        winphoneEnableCancelButton: true,
                    };
                    $cordovaActionSheet.show(options).then(function(btnIndex) {
                        if (btnIndex === 1) { // delete img
                            var promise;
                            if (picture.id) {
                                promise = NotePicturesFactory.deletePicture(picture.id);
                            } else {
                                promise = $q.when(); // empty promise
                            }
                            promise.then(function() {
                                deleteLocalPicture(picture);
                            }, function(err) { // err can only happen if image was in DB
                                DialogFactory.showErrorDialog('Erreur, impossible de supprimer l\'image');
                            });
                        } else if (btnIndex === 2) { // share data
                            $cordovaSocialSharing
                                .share($scope.note.comment, $scope.note.title, picture.picture) // Share via native share sheet
                                .then(function(result) {
                                    DialogFactory.showSuccessDialog('L\'image a bien été partagée');
                                }, function(err) {
                                    DialogFactory.showErrorDialog('Erreur, impossible de partager l\'image');
                                });
                        }
                    });
                };

                function deleteLocalPicture(picture) {
                    $scope.$parent.pictures.splice($scope.$parent.pictures.indexOf(picture), 1);
                    if (!picture.id) {
                        $scope.$parent.newPictures.splice($scope.$parent.newPictures.indexOf(picture), 1);
                    }
                };

                function deleteLocalVideo(video) {
                    $scope.$parent.videos.splice($scope.videos.indexOf(video), 1);
                    if (!video.id) {
                        $scope.$parent.newVideos.splice($scope.$parent.newVideos.indexOf(video), 1);
                    }
                };

                function deleteLocalAudio(audio) {
                    $scope.$parent.audios.splice($scope.audios.indexOf(audio), 1);
                    if (!audio.id) {
                        $scope.$parent.newAudios.splice($scope.$parent.newAudios.indexOf(audio), 1);
                    }
                };
            });
})();
