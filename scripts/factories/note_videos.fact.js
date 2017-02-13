(function() {
    'use strict';
    angular.module('app').factory("NoteVideosFactory",
        function($q, DbFactory) {
            var self = {
                // fetch the videos of a note
                getVideosByNoteId: function(noteId) {
                    return DbFactory.execQuery("select * from NoteVideos where noteId = ?", [noteId], function(res) {
                        var videos = [];
                        var rowLength = res.rows.length;
                        for (var i = 0; i < rowLength; i++) {
                            videos.push(res.rows.item(i));
                        }
                        return videos;
                    });

                },
                // add multiple videos at once
                batchAddVideo: function(videos, noteId) {
                    if(videos.length === 0) {
                        var deferred = $q.defer();
                        deferred.resolve("finished");
                        return deferred.promise;
                    }
                    var queries = [];
                    var params = [];
                    for(var i in videos) {
                        queries.push("INSERT INTO NoteVideos (video, noteId) VALUES (?,?)");
                        params.push([videos[i].video, noteId]);
                    }
                    return DbFactory.execTransaction(queries, params);
                },
                addVideo: function(video, noteId) {
                    return DbFactory.execQuery("insert into NoteVideos (video, noteId) values (?, ?)", [video, noteId]);
                },
                deleteVideo: function(id) {
                    return DbFactory.execQuery("delete from NoteVideos where id = ?", [id]);
                },
                deleteAllVideosOfNote: function(noteId) {
                    return DbFactory.execQuery("delete from NoteVideos where noteId = ?", [noteId]);
                },
                updateVideo: function(id, video) {
                    return DbFactory.execQuery("update NoteVideos set video = ? where id = ?", [video, id]);
                }
            };
            return self;
        }
    );
})();
