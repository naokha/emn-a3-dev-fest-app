(function() {
    'use strict';
    angular.module('app').factory("DbFactory",
        function($q, $cordovaSQLite) {
            var db = null;
            var self = {
                execQuery: function(query, params, callback) {
                    var deferred = $q.defer();
                    getDb().then(function(database) {
                        $cordovaSQLite.execute(database, query, params).then(function(res) {
                            if (callback) {
                                deferred.resolve(callback(res));
                            } else {
                                deferred.resolve(res);
                            }

                        }, function(err) {
                            deferred.reject(err);
                        });
                    });
                    return deferred.promise;
                },
                execTransaction: function(queries, params) {
                    var deferred = $q.defer();
                    getDb().then(function(database) {
                        database.transaction(function(tx) {
                            for (var i in queries) {
                                tx.executeSql(queries[i], params[i]);
                            }
                        }, function(err) {
                            deferred.reject(err);
                        }, function(res) {
                            deferred.resolve(res);
                        });
                    });
                    return deferred.promise;
                }
            }
            return self;

            function getDb() {
                if (!db) {
                    return createDb();
                }
                var deferred = $q.defer();
                deferred.resolve(db);
                return deferred.promise;
            }

            function createDb() {
                var deferred = $q.defer();
                db = $cordovaSQLite.openDB({ name: "conferenceDatabase", location: 'default' });
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS SessionNotes(id integer primary key, title text, comment text, sessionId text)");
                    tx.executeSql("CREATE TABLE IF NOT EXISTS NotePictures(id integer primary key, picture text, noteId text, FOREIGN KEY (noteId) REFERENCES SessionNotes(id))");
                    tx.executeSql("CREATE TABLE IF NOT EXISTS NoteVideos(id integer primary key, video text, noteId text, FOREIGN KEY (noteId) REFERENCES SessionNotes(id))");
                    tx.executeSql("CREATE TABLE IF NOT EXISTS NoteAudios(id integer primary key, audio text, noteId text, FOREIGN KEY (noteId) REFERENCES SessionNotes(id))");
                }, function(err) {
                    deferred.reject(err);
                }, function(res) {
                    deferred.resolve(db);
                });
                return deferred.promise;
            }
        });
})();
