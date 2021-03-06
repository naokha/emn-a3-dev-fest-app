(function() {
    'use strict';
    angular.module('app').factory("SessionNotesFactory",
        function($q, DbFactory, $cordovaSQLite, NotePicturesFactory, NoteVideosFactory, NoteAudiosFactory) {
            var self = {
                // create an empty note for create mode
                createNewNote: function(sessionId) {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'title': '',
                        'comment': '',
                        'sessionId': sessionId
                    })
                    return deferred.promise;
                },
                // find one note by its id
                getNoteById: function(noteId) {
                    return DbFactory.execQuery("select * from SessionNotes where id = ?", [noteId], function(res) {
                        return res.rows.item(0);
                    });
                },
                // retrieve all the notes associated to a session
                getNotesBySessionId: function(sessionId) {
                    return DbFactory.execQuery("select * from SessionNotes where sessionId = ?", [sessionId], function(res) {
                        var notes = [];
                        var rowLength = res.rows.length;
                        for (var i = 0; i < rowLength; i++) {
                            notes.push(res.rows.item(i));
                        }
                        return notes;
                    });
                },
                // create a note and then associate pictures if provided
                addNote: function(note, newPictures, newVideos, newAudios) {
                    return DbFactory.execQuery("insert into SessionNotes (title, comment, sessionId) values (?, ?, ?)", [note.title, note.comment, note.sessionId]).then(function(res){ // first we create the note
                        var noteId = res.insertId;
                        var promises = [];
                        promises.push(NotePicturesFactory.batchAddPicture(newPictures, noteId)); // we add all the pictures
                        promises.push(NoteVideosFactory.batchAddVideo(newVideos, noteId)); // we add all the videos
                        promises.push(NoteAudiosFactory.batchAddAudio(newAudios, noteId)); // we add all the audios
                        return $q.all(promises);
                    });
                },
                // delete pictures associated to a note and then delete the note
                deleteNote: function(id) {
                    var promises = [];
                    promises.push(NotePicturesFactory.deleteAllPicturesOfNote(id));
                    promises.push(NoteVideosFactory.deleteAllVideosOfNote(id));
                    promises.push(NoteAudiosFactory.deleteAllAudiosOfNote(id));
                    return $q.all(promises).then(function(res) { // first we delete pictures and videos associated to the note
                        return DbFactory.execQuery("delete from SessionNotes where id = ?", [id]); // then we delete the note
                    });
                },
                // update a note and its pictures
                updateNote: function(note, newPictures, newVideos, newAudios) {
                    var promises = [];
                    /*
                        We update the note and add the new pictures, audios and videos in the same time as the note is already in the DB
                     */
                    promises.push(DbFactory.execQuery("update SessionNotes set title = ?, comment = ? where id = ?", [note.title, note.comment, note.id]));
                    promises.push(NotePicturesFactory.batchAddPicture(newPictures, note.id));
                    promises.push(NoteVideosFactory.batchAddVideo(newVideos, note.id));
                    promises.push(NoteAudiosFactory.batchAddAudio(newAudios, note.id));
                    return $q.all(promises);
                }
            };
            return self;
        }
    );
})();
