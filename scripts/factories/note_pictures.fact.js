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
                        deferred.resolve([]);
                        return deferred.promise;
                    }
                    var promises = [];
                    for(var i in pictures) {
                        promises.push(DbFactory.execQuery("INSERT INTO NotePictures (picture, noteId) VALUES (?,?)", [pictures[i].picture, noteId]));
                    }
                    return $q.all(promises);
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
