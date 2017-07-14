(function () {
"use strict";

angular.module('service',['angularFileUpload','ngCookies'])
.constant('fileUploadUrl','/instructors/createassignment')
.constant('REMOTE_SERVER','http://localhost:3000')
.constant('REQUEST_URL',{
	LOGIN:'/users/login',
	LOGOUT:'/users/logout',
	STUDENT:'/students',
	STUDENT_ASSIGNMENT:'/assignments',
	STUDENT_ASSIGNMENT_BYID:'/getassignmentbyid',
	STUDENT_SUBMIT_SAVE:'/updateorsubmitassignment',
	INSTRUCTOR:'/instructors',
	STUDENT_LIST:'/studentlist',
	ASSIGNMENT_LIST:'/getassignmentlist',
	ASSIGNMENT_BY_ID:'/getassignmentbyid',
	STUDNETS_IN_ASSIGMENT:'/studentsinassignments',
	PENDINGEVALUATION:'/getPendingEvaluation',
	EVALUATION:'/submitevaluation',
	SUBMISSION:'/getSubmission',
	DELETE_ALL_ASSIGNMENT:'/deleteassignmentandtemplate',
	DELETE_ASSIGNMENT_BY_ID:'/deleteassignmentById'
});

})();
