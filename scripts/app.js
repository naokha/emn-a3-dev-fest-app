(function() {
    'use strict';
    document.addEventListener('deviceready', function() {
        /*
            We bootstrap the application only once the phone is ready
            We do this in order to avoid the use of deviceready in controllers which complicates the code
         */
        angular.bootstrap(document, ['app']);
    });
    var app = angular.module('app', ['ui.router', 'app.controllers', 'ngSanitize', 'ngCordova', 'ngAnimate', 'anim-in-out'])
        .run(function($rootScope) {
            FastClick.attach(document.body);
            $rootScope.$on('$viewContentLoaded', function() { // what do to each time the ui view is populated
                $('.dropdown-button').dropdown();
                $('.modal').modal();
            });
            $rootScope.$on('$stateChangeSuccess', function() {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                $('.modal').modal('close');
            });
        })
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('conference', {
                    url: '/',
                    templateUrl: "templates/conference.tpl.html"
                })
                .state('agenda', {
                    url: '/agenda',
                    templateUrl: "templates/agenda.tpl.html",
                    controller: "AgendaCtrl",
                    resolve: {
                        agendaSchedules: function(AgendaFactory) {
                            return AgendaFactory.getAgendaSchedules();
                        },
                        sessions: function(SessionsFactory) {
                            return SessionsFactory.getSessions();
                        },
                        schedules: function(AgendaFactory) {
                            return AgendaFactory.getSchedules();
                        }
                    }
                })
                .state("sessions", {
                    url: '/sessions',
                    templateUrl: "templates/sessions.tpl.html",
                    controller: "SessionsCtrl",
                    resolve: {
                        sessions: function(SessionsFactory) {
                            return SessionsFactory.getSessions();
                        }
                    }
                })
                .state("sessions-detail", {
                    url: '/sessions/:sessionId',
                    templateUrl: "templates/session_detail.tpl.html",
                    controller: 'SessionCtrl',
                    resolve: {
                        session: function($stateParams, SessionsFactory) {
                            return SessionsFactory.getSessionById($stateParams.sessionId);
                        },
                        sessionPresenters: function($stateParams, PresentersFactory) {
                            return PresentersFactory.getPresentersBySession($stateParams.sessionId);
                        }
                    }
                })
                .state("sessions-detail-notes", {
                    url: '/sessions/:sessionId/notes',
                    templateUrl: "templates/session_notes.tpl.html",
                    controller: 'NotesCtrl',
                    resolve: {
                        notes: function($stateParams, SessionNotesFactory) {
                            return SessionNotesFactory.getNotesBySessionId($stateParams.sessionId);
                        },
                        session: function($stateParams, SessionsFactory) {
                            return SessionsFactory.getSessionById($stateParams.sessionId);
                        },
                    }
                })
                .state("sessions-detail-notes-detail", {
                    url: '/sessions/:sessionId/notes/:noteId',
                    templateUrl: "templates/note_detail.tpl.html",
                    controller: 'NoteCtrl',
                    resolve: {
                        note: function($stateParams, SessionNotesFactory) {
                            return SessionNotesFactory.getNoteById($stateParams.noteId);
                        },
                        session: function($stateParams, SessionsFactory) {
                            return SessionsFactory.getSessionById($stateParams.sessionId);
                        },
                        pictures: function($stateParams, NotePicturesFactory) {
                            return NotePicturesFactory.getPicturesByNoteId($stateParams.noteId);
                        },
                        videos: function($stateParams, NoteVideosFactory) {
                            return NoteVideosFactory.getVideosByNoteId($stateParams.noteId);
                        },
                        audios: function($stateParams, NoteAudiosFactory) {
                            return NoteAudiosFactory.getAudiosByNoteId($stateParams.noteId);
                        }
                    },
                    params: {
                        mode: 'edit'
                    }
                })
                .state("sessions-detail-notes-new", {
                    url: '/sessions/:sessionId/new_note',
                    templateUrl: "templates/note_detail.tpl.html",
                    controller: 'NoteCtrl',
                    resolve: {
                        note: function($stateParams, SessionNotesFactory) {
                            return SessionNotesFactory.createNewNote($stateParams.sessionId);
                        },
                        session: function($stateParams, SessionsFactory) {
                            return SessionsFactory.getSessionById($stateParams.sessionId);
                        },
                        pictures: function() {
                            return [];
                        },
                        videos: function() {
                            return [];
                        },
                        audios: function() {
                            return [];
                        }
                    },
                    params: {
                        mode: 'create'
                    }
                })
                .state("presenters", {
                    url: '/presenters',
                    templateUrl: "templates/presenters.tpl.html",
                    controller: "PresentersCtrl",
                    resolve: {
                        presenters: function(PresentersFactory) {
                            return PresentersFactory.getPresenters();
                        }
                    }
                })
                .state("presenters-detail", {
                    url: '/presenters/:presenterId',
                    templateUrl: "templates/presenter_detail.tpl.html",
                    controller: "PresenterCtrl",
                    resolve: {
                        presenter: function($stateParams, PresentersFactory) {
                            return PresentersFactory.getPresenterById($stateParams.presenterId);
                        },
                        presenterSessions: function($stateParams, SessionsFactory) {
                            return SessionsFactory.getSessionsByPresenterId($stateParams.presenterId);
                        }
                    }
                })
                .state("about_phone", {
                    url: '/about_phone',
                    templateUrl: "templates/about_phone.tpl.html",
                    controller: "AboutPhoneCtrl"
                })
                // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/');

        });
    if (!window.cordova) {

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['app']);
        });
    }
})();
