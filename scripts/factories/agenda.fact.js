(function() {
    'use strict';
    angular.module('app').factory("AgendaFactory",
        function(DataDevFest, DbFactory, $q) {
            var schedules = null;
            var self = {
                // get the schedules from the json data
                getSchedules: function() {
                    if (!schedules) {
                        return loadSchedules();
                    }
                    var deferred = $q.defer();
                    deferred.resolve(schedules);
                    return deferred.promise;
                },
                // get the schedules from agenda in DB
                getAgendaSchedules: function() {
                    return DbFactory.execQuery("select * from Agenda", [], function(res) {
                        var agendaSchedules = [];
                        var rowLength = res.rows.length;
                        for (var i = 0; i < rowLength; i++) {
                            agendaSchedules.push(res.rows.item(i));
                        }
                        return agendaSchedules;
                    });
                },
                addAgendaSchedule: function(hourStart, minStart, hourEnd, minEnd, sessionId) {
                    return DbFactory.execQuery("insert into Agenda (hourStart, minStart, hourEnd, minEnd, sessionId) values (?, ?, ?, ?, ?)", [hourStart, minStart, hourEnd, minEnd, sessionId])
                },
                deleteAgendaSchedule: function(id) {
                    return DbFactory.execQuery("delete from Agenda where id = ?", [id]);
                },
                // find one specific schedule from the json data
                getSessionSchedule: function(scheduleId) {
                    var deferred = $q.defer();
                    self.getSchedules().then(function(scheds) {
                        if (scheds[scheduleId]) {
                            deferred.resolve(scheds[scheduleId]);
                        } else {
                            deferred.reject("Schedule with id " + scheduleId + " was not found in the list of schedules");
                        }
                    })
                    return deferred.promise;
                }
            };
            return self;

            function loadSchedules() {
                var deferred = $q.defer();
                DataDevFest.getData().then(function(res) {
                    schedules = res.hours;
                    deferred.resolve(schedules);
                });
                return deferred.promise;
            }
        }
    );
})();
