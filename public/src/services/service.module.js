(function () {
"use strict";

angular.module('service',['angularFileUpload','ngCookies'])
.constant('fileUploadUrl','/instructors/createassignment')
.constant('REMOTE_SERVER','http://localhost:3000')
.constant('REQUEST_URL',{
	LOGIN:'/users/login',
	STUDENT:'/students',
	INSTRUCTOR:'/instructors',
	STUDENT_LIST:'/studentlist',
	ASSIGNMENT_LIST:'/getassignmentlist',
	ASSIGNMENT_BY_ID:'/getassignmentbyid',
	STUDNETS_IN_ASSIGMENT:'/studentsinassignments',
	EVALUATION:'/submitevaluation',
	SUBMISSION:'/getSubmission'
});

})();
