(function() {
    'use strict';
    angular.module('app').factory("DataDevFest",
        function($http, $q) {
        	var data = null;
        	var self =  {
                getData: function(){
                    if(!data) {
                        return loadData();
                    }
                    var deferred = $q.defer();
                    deferred.resolve(data);
                    return deferred.promise;
                }
            };
            return self;
            function loadData(){
                var deferred = $q.defer();
                $http.get("data/devfest-2015.json").then(function(res){
                    deferred.resolve(res.data);
                })
                return deferred.promise;
            }
        }
    );
})();
