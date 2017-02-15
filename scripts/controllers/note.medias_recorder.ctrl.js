(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('MediasRecorderCtrl',
            function($scope, DialogFactory, MediasFactory) {
                $scope.takeAudio = function() {
                    MediasFactory.takeAudio().then(function(newAudio) {
                        $scope.$parent.newAudios.push(newAudio);
                        $scope.$parent.audios.push(newAudio);
                    }, function(err) {
                        if (err.code !== 3) {
                            DialogFactory.showErrorDialog('Erreur, un problème a eu lieu lors de la capture du son');
                        }
                    })
                }

                $scope.takeVideo = function() {
                    MediasFactory.takeVideo().then(function(newVideo) {
                        $scope.$parent.newVideos.push(newVideo);
                        $scope.$parent.videos.push(newVideo);
                    }, function(err) {
                        if (err.code !== 3) {
                            DialogFactory.showErrorDialog('Erreur, un problème a eu lieu lors de la capture de la vidéo');
                        }
                    })
                }

                $scope.takePicture = function(source) {
                    MediasFactory.takePicture(source).then(function(newPicture) {
                        $scope.$parent.pictures.push(newPicture);
                        $scope.$parent.newPictures.push(newPicture);
                    }, function(err) {
                        if (err.indexOf("cancel") === -1) {
                            DialogFactory.showErrorDialog('Erreur, un problème a eu lieu lors de la capture de l\'image');
                        }
                    })
                }
            });
})();
