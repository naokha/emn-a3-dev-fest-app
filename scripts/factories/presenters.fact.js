(function() {
    'use strict';
    angular.module('app').factory("PresentersFactory",
        function(DataDevFest, $q, SessionsFactory) {
            var presenters = null;
            var self = {
                getPresenters: function() {
                    if (!presenters) {
                        return loadPresenters();
                    }
                    var deferred = $q.defer();
                    deferred.resolve(presenters);
                    return deferred.promise;
                },
                getPresenterById: function(presenterId) {
                    var deferred = $q.defer();
                    self.getPresenters().then(function(pres) {
                        var presenter = pres.filter(function(presenter) {
                            return presenter.id === presenterId;
                        })
                        if (presenter.length === 0) {
                            deferred.reject("Presenter with id " + presenterId + " was not found in the list of presenters");
                        } else {
                            deferred.resolve(presenter[0]); // return the first presenter found with the id (should have only one)
                        }
                    })
                    return deferred.promise;
                },
                getPresentersBySession: function(sessionId) {
                    var deferred = $q.defer();
                    var presenters = [];
                    var promises = [];
                    SessionsFactory.getSessionById(sessionId).then(function(session) {
                        for (var i in session.speakers) {
                            promises.push(self.getPresenterById(session.speakers[i]));
                        }
                        $q.all(promises).then(function(res){
                            deferred.resolve(res);
                        })
                    })
                    return deferred.promise;
                }
            };
            return self;

            function loadPresenters() {
                var deferred = $q.defer();
                DataDevFest.getData().then(function(res) {
                    presenters = res.speakers;
                    deferred.resolve(presenters);
                });
                return deferred.promise;
            }
        }
    );
})();
