(function() {
    'use strict';
    angular.module('app').factory("SessionsFactory",
        function(DataDevFest, $q) {
            var sessions = null;
            var self = {
                getSessions: function() {
                    if (!sessions) {
                        return loadSessions();
                    }
                    var deferred = $q.defer();
                    deferred.resolve(sessions);
                    return deferred.promise;
                },
                getSessionById: function(sessionId) {
                    var deferred = $q.defer();
                    self.getSessions().then(function(sess) {
                        var session = sess.filter(function(session) {
                            return session.id === sessionId;
                        })
                        if (session.length === 0) {
                            throw ("Session with id " + sessionId + " was not found in the list of sessions");
                        } else {
                            deferred.resolve(session[0]); // return the first session found with the id (should have only one)
                        }
                    })
                    return deferred.promise;
                },
                getSessionsByPresenterId: function(presenterId) {
                    var deferred = $q.defer();
                    self.getSessions().then(function(sess) {
                        var sessions = sess.filter(function(session) {
                            for (var i in session.speakers) {
                                if(session.speakers[i] === presenterId) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        deferred.resolve(sessions);
                    })
                    return deferred.promise;
                }
            };
            return self;

            function loadSessions() {
                var deferred = $q.defer();
                DataDevFest.getData().then(function(res) {
                    sessions = res.sessions;
                    deferred.resolve(sessions);
                });
                return deferred.promise;
            }
        }
    );
})();
