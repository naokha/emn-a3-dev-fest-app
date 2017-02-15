(function() {
    'use strict';
    angular.module('app.controllers')
        .controller('MediasCtrl',
            function($scope, DialogFactory, MediasFactory) {
                $scope.takeAudio = function() {
                    MediasFactory.takeAudio().then(function(newAudio) {
                        $scope.$parent.newAudios.push(newAudio);
                        $scope.$parent.audios.push(newAudio);
                    }, function(err) {
                        DialogFactory.showErrorDialog('Erreur, un problème a eu lieu lors de la capture du son');
                    })
                }

                $scope.takeVideo = function() {
                    MediasFactory.takeVideo().then(function(newVideo) {
                        $scope.$parent.newVideos.push(newVideo);
                        $scope.$parent.videos.push(newVideo);
                    }, function(err) {
                        DialogFactory.showErrorDialog('Erreur, un problème a eu lieu lors de la capture de la vidéo');
                    })
                }

                $scope.takePicture = function(source) {
                    MediasFactory.takePicture(source).then(function(newPicture) {
                        $scope.$parent.pictures.push(newPicture);
                        $scope.$parent.newPictures.push(newPicture);
                    }, function(err) {
                        DialogFactory.showErrorDialog('Erreur, un problème a eu lieu lors de la capture de l\'image');
                    })
                }
            });
})();
