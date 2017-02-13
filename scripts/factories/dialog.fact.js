(function() {
    'use strict';
    angular.module('app').factory("DialogFactory",
        function() {
            var dialogDuration = 2000;
            var self = {
                showSuccessDialog: function(message) {
                    showDialog(message, 'green');
                },
                showErrorDialog: function(message) {
                    showDialog(message, 'red');
                }
            };
            return self;

            function showDialog(message, color) {
                Materialize.toast(message, dialogDuration, color);
            }
        }
    );
})();
