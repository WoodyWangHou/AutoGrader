(function(){
'use strict'

    angular.module('instructor')
    .config(config);

    config.$inject=['$stateProvider','INSTRUCTOR_STATE'];
    function config($stateProvider,INSTRUCTOR_STATE){
      // If user goes to a path that doesn't exist, redirect to public root
      var cssList = [
                "css/fullcalendar.css",
                "css/matrix-style.css",
                "css/matrix-media.css",
                "font-awesome/css/font-awesome.css",
                "css/jquery.gritter.css",
                'http://fonts.googleapis.com/css?family=Open+Sans:400,700,800'
              ];

      $stateProvider
        .state('instructor_init',{
          url:'/instructor',
          abstract:true,
          templateUrl:'src/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'dbCtrl'
        })
        .state(INSTRUCTOR_STATE.HOME, {
          parent:'instructor_init',
          url:'/home',
          templateUrl: 'src/instructor/home-main/home-main.html',
          controller: 'instruHomeController',
          controllerAs: 'instruHomeCtrl',
          css:cssList
        })
        .state(INSTRUCTOR_STATE.HOME_STUDENT, {
          parent:'instructor_init',
          url: '/students',
          templateUrl: 'src/instructor/student-list/student-list.html',
          controller: 'studentListController',
          controllerAs: 'stuListCtrl',
          css:cssList
        })
        .state(INSTRUCTOR_STATE.HOME_STUDENT_FORM, {
          url: '/:assignmentId',
          templateUrl: 'src/instructor/assignment-form/assignment-form.html',
          controller: 'instruAssignmentFormController',
          controllerAs: 'instructorFormCtrl',
          css:cssList
        })
        .state(INSTRUCTOR_STATE.HOME_ASSIGNMENT, {
          parent:'instructor_init',
          url:'/assignments',
          templateUrl: 'src/instructor/assignment-list/assignment-list.html',
          controller: 'instrucAssignmentListController',
          controllerAs: 'instructorAssignListCtrl',
          css:cssList
        })
        .state(INSTRUCTOR_STATE.HOME_ASSIGNMENT_FORM, {
          url:'/:assignmentId',
          templateUrl: 'src/instructor/assignment-form/assignment-form.html',
          controller: 'instruAssignmentFormController',
          controllerAs: 'instructorFormCtrl',
          css:cssList
        })
        ;
      }

})();
