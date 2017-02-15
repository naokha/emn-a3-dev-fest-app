(function() {
    'use strict';
    angular.module('app').factory("NoteAudiosFactory",
        function($q, DbFactory) {
            var self = {
                // fetch the audios of a note
                getAudiosByNoteId: function(noteId) {
                    return DbFactory.execQuery("select * from NoteAudios where noteId = ?", [noteId], function(res) {
                        var audios = [];
                        var rowLength = res.rows.length;
                        for (var i = 0; i < rowLength; i++) {
                            audios.push(res.rows.item(i));
                        }
                        return audios;
                    });

                },
                // add multiple audios at once
                batchAddAudio: function(audios, noteId) {
                    if(audios.length === 0) {
                        var deferred = $q.defer();
                        deferred.resolve([]);
                        return deferred.promise;
                    }
                    var promises = [];
                    for(var i in audios) {
                        promises.push(DbFactory.execQuery("INSERT INTO NoteAudios (audio, noteId) VALUES (?,?)", [audios[i].audio, noteId]));
                    }
                    return $q.all(promises);
                },
                addAudio: function(audio, noteId) {
                    return DbFactory.execQuery("insert into NoteAudios (audio, noteId) values (?, ?)", [audio, noteId]);
                },
                deleteAudio: function(id) {
                    return DbFactory.execQuery("delete from NoteAudios where id = ?", [id]);
                },
                deleteAllAudiosOfNote: function(noteId) {
                    return DbFactory.execQuery("delete from NoteAudios where noteId = ?", [noteId]);
                }
            };
            return self;
        }
    );
})();
