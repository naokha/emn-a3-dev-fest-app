(function() {
    'use strict';

    function sortSchedule(a, b) {
        return (a.hourStart < b.hourStart || (a.hourStart === b.hourStart && a.minStart <= b.minStart)) ? -1 : 1;
    }
    angular.module('app.controllers')
        .filter('scheduleSorter', function() { // sorter for agenda schedules
            return function(schedules) {
                var filtered = [];
                angular.forEach(schedules, function(schedule) {
                    filtered.push(schedule);
                });
                filtered.sort(function(a, b) {
                    return sortSchedule(a, b);
                });
                return filtered;
            };
        })
        .filter('sortSessionBySchedule', function() { // sorter for session by schedule
            return function(sessions, schedules) {
                var filtered = [];
                angular.forEach(sessions, function(session) {
                    filtered.push(session);
                })
                filtered.sort(function(a, b) {
                    var scheduleA = schedules[a.hour];
                    var scheduleB = schedules[b.hour];
                    return sortSchedule(scheduleA, scheduleB);
                })
                return filtered;
            }
        })
        .controller('AgendaCtrl',
            function($scope,
                agendaSchedules,
                AgendaFactory,
                DialogFactory,
                schedules,
                sessions) {

                /**
                 * Init function
                 * @return
                 */
                $scope.init = function() {
                    $scope.seePastSessions = true;
                    $scope.sessions = sessions;
                    $scope.schedules = schedules;
                    $scope.agendaSchedules = agendaSchedules;
                    $scope.sessionsAlreadyChoosen = [];
                    for (var i in $scope.agendaSchedules) {
                        $scope.sessionsAlreadyChoosen.push($scope.agendaSchedules[i].sessionId);
                    }
                }

                /**
                 * Compute whether or not the session in the agenda can be visible
                 */
                $scope.canSeeSession = function(agendaSchedule) {
                    var date = new Date;
                    return $scope.seePastSessions || (date.getHours() <= agendaSchedule.hourEnd && date.getMinutes() <= agendaSchedule.minEnd);
                }

                /**
                 * Check if the session related to the agenda schedule is currently running
                 */
                $scope.sessionIsNow = function(agendaSchedule) {
                    var date = new Date;
                    var hour = date.getHours();
                    var minutes = date.getMinutes();
                    return parseSchedule(agendaSchedule.hourStart) <= hour 
                    && parseSchedule(agendaSchedule.hourEnd) >= hour 
                    && parseSchedule(agendaSchedule.minStart) <= minutes 
                    && parseSchedule(agendaSchedule.minEnd) >= minutes;
                }

                /**
                 * Retrieve the session linked to an agenda schedule
                 */
                $scope.getSessionOfAgendaSchedule = function(agendaSchedule) {
                    var session;
                    $scope.sessions.some(function(item, index) {
                        session = item;
                        return item.id === agendaSchedule.sessionId;
                    })
                    return session;
                }

                $scope.isSessionInAgendaSchedules = function(sessionId) {
                    return $scope.sessionsAlreadyChoosen.indexOf(sessionId) !== -1;
                }

                /**
                 * Check if we can add a session in the agenda
                 */
                $scope.canAddSession = function(session) {
                    return !$scope.isSessionInAgendaSchedules(session.id) && !isSessionOverlapping($scope.schedules[session.hour]);
                }

                /**
                 * Check if the schedules not in the agenda are overlapping with at least one in the agenda
                 */
                function isSessionOverlapping(potentialSchedule) {
                    var agendaSchedule;
                    var agendaScheduleStart;
                    var agendaScheduleEnd;
                    var potentialScheduleStart = computeScheduleStartInMin(potentialSchedule);
                    var potentialScheduleEnd = computeScheduleEndInMin(potentialSchedule);
                    for (var i in $scope.agendaSchedules) {
                        agendaSchedule = $scope.agendaSchedules[i];
                        agendaScheduleStart = computeScheduleStartInMin(agendaSchedule);
                        agendaScheduleEnd = computeScheduleEndInMin(agendaSchedule);
                        if (!(checkScheduleStartsAfterPotential(agendaScheduleStart, potentialScheduleStart, potentialScheduleEnd) ||
                                checkScheduleEndsBeforePotential(agendaScheduleEnd, potentialScheduleStart, potentialScheduleEnd))) {
                            return true;
                        }
                    }
                    return false;
                }
                /**
                 * Check that the start time of an agenda schedule is after the start and end time of a schedule not in the agenda
                 */
                function checkScheduleStartsAfterPotential(scheduleSart, potentialScheduleStart, potentialScheduleEnd) {
                    return scheduleSart >= potentialScheduleStart && scheduleSart >= potentialScheduleEnd;
                }

                /**
                 * Check that the end time of an agenda schedule is before the start and end time of a schedule not in the agenda
                 */
                function checkScheduleEndsBeforePotential(scheduleEnd, potentialScheduleStart, potentialScheduleEnd) {
                    return scheduleEnd <= potentialScheduleStart && scheduleEnd <= potentialScheduleEnd;
                }

                /**
                 * Parse the schedule hours and min as integers
                 */
                function parseSchedule(data) {
                    return parseInt(data, 10);
                }

                /**
                 * Compute the start time of a schedule (hours + minutes) in minutes
                 */
                function computeScheduleStartInMin(schedule) {
                    return parseSchedule(schedule.hourStart) * 60 + parseSchedule(schedule.minStart);
                }

                /**
                 * Compute the end time of a schedule (hours + minutes) in minutes
                 */
                function computeScheduleEndInMin(schedule) {
                    return parseSchedule(schedule.hourEnd) * 60 + parseSchedule(schedule.minEnd)
                }


                $scope.addSchedule = function(session) {
                    var schedule = $scope.schedules[session.hour];
                    AgendaFactory.addAgendaSchedule(schedule.hourStart, schedule.minStart, schedule.hourEnd, schedule.minEnd, session.id).then(function(res) {
                        $scope.agendaSchedules.push({
                            "hourStart": schedule.hourStart,
                            "minStart": schedule.minStart,
                            "hourEnd": schedule.hourEnd,
                            "minEnd": schedule.minEnd,
                            "sessionId": session.id,
                            "id": res.insertId
                        });
                        $scope.sessionsAlreadyChoosen.push(session.id);
                        DialogFactory.showSuccessDialog('La session ' + session.title + 'a bien été ajoutée à votre agenda');
                    }, function(err) {
                        DialogFactory.showErrorDialog('Erreur, impossible d\'ajouter la session ' + session.title + ' à votre agenda');
                    })
                }

                function findAgendaScheduleBySession(session) {
                    var agendaSchedule;
                    $scope.agendaSchedules.some(function(item, index) {
                        agendaSchedule = item;
                        return item.sessionId === session.id;
                    })
                    return agendaSchedule;
                }

                $scope.deleteSchedule = function(session) {
                    var agendaSchedule = findAgendaScheduleBySession(session);
                    AgendaFactory.deleteAgendaSchedule(agendaSchedule.id).then(function(res) {
                        $scope.sessionsAlreadyChoosen.splice($scope.sessionsAlreadyChoosen.indexOf(session.id), 1);
                        $scope.agendaSchedules.splice($scope.agendaSchedules.indexOf(agendaSchedule), 1);
                        DialogFactory.showSuccessDialog('La session ' + session.title + ' a bien été supprimée de votre agenda');
                    }, function(err) {
                        DialogFactory.showErrorDialog('Erreur, impossible de supprimer la session ' + session.title + 'de votre agenda');
                    })
                }
                $scope.init();
            });
})();
