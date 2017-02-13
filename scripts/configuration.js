"use strict";

 angular.module('config', [])
.constant('DB_CONF', {
	"SessionNotes": {
		"columns" : [
			{
				"name" : "id",
				"type" : "integer",
				"isPk" : true
			},
			{
				"name" : "title",
				"type" : "text"
			},
			{
				"name" : "comment",
				"type" : "text"
			},
			{
				"name" : "sessionId",
				"type": "text",
			}
		]
	}
})
;