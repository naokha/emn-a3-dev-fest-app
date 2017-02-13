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
                        deferred.resolve("finished");
                        return deferred.promise;
                    }
                    var queries = [];
                    var params = [];
                    for(var i in audios) {
                        queries.push("INSERT INTO NoteAudios (audio, noteId) VALUES (?,?)");
                        params.push([audios[i].video, noteId]);
                    }
                    return DbFactory.execTransaction(queries, params);
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
