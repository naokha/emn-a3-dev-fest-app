(function() {
    'use strict';
    angular.module('app').factory("NotePicturesFactory",
        function($q, DbFactory, $cordovaSQLite) {
            var self = {
                // fetch the pictures of a note
                getPicturesByNoteId: function(noteId) {
                    return DbFactory.execQuery("select * from NotePictures where noteId = ?", [noteId], function(res) {
                        var pictures = [];
                        var rowLength = res.rows.length;
                        for (var i = 0; i < rowLength; i++) {
                            pictures.push(res.rows.item(i));
                        }
                        return pictures;
                    });

                },
                // add multiple pictures at once
                batchAddPicture: function(pictures, noteId) {
                    if(pictures.length === 0) {
                        var deferred = $q.defer();
                        deferred.resolve("finished");
                        return deferred.promise;
                    }
                    var queries = [];
                    var params = [];
                    for(var i in pictures) {
                        queries.push("INSERT INTO NotePictures (picture, noteId) VALUES (?,?)");
                        params.push([pictures[i].picture, noteId]);
                    }
                    return DbFactory.execTransaction(queries, params);
                },
                addPicture: function(picture, noteId) {
                    return DbFactory.execQuery("insert into NotePictures (picture, noteId) values (?, ?)", [picture, noteId]);
                },
                deletePicture: function(id) {
                    return DbFactory.execQuery("delete from NotePictures where id = ?", [id]);
                },
                deleteAllPicturesOfNote: function(noteId) {
                    return DbFactory.execQuery("delete from NotePictures where noteId = ?", [noteId]);
                },
                updatePicture: function(id, picture) {
                    return DbFactory.execQuery("update NotePictures set picture = ? where id = ?", [picture, id]);
                }
            };
            return self;
        }
    );
})();
