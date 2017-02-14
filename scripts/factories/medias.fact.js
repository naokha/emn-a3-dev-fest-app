(function() {
    'use strict';
    angular.module('app').factory("MediasFactory",
        function($cordovaCapture, $cordovaCamera, $q) {
            var audioOptions = {
                limit: 3,
                duration: 10
            };
            var videoOptions = {
                limit: 3,
                duration: 15
            };
            var pictureOptions = {
                allowEdit: false,
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 600,
                targetHeight: 400,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            var self = {
                takeAudio: function() {
                    var deferred = $q.defer();
                    $cordovaCapture.captureAudio(audioOptions).then(function(audioData) {
                        deferred.resolve({
                            "audio": audioData[0].fullPath
                        });
                    }, function(err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                takeVideo: function() {
                    var deferred = $q.defer();
                    $cordovaCapture.captureVideo(videoOptions).then(function(videoData) {
                        deferred.resolve({
                            "video": videoData[0].fullPath
                        });
                    }, function(err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                takePicture: function(source) {
                    var deferred = $q.defer();
                    var options = pictureOptions;
                    if (source === 'library') {
                        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                    } else {
                        options.sourceType = Camera.PictureSourceType.CAMERA;
                    }
                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        deferred.resolve({
                            "picture": "data:image/jpeg;base64," + imageData
                        });
                    }, function(err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                }
            };
            return self;
        }
    );
})();
