(function(){
'use strict'

    angular.module('instructor')
    .config(config);

    config.$inject=['$stateProvider','INSTRUCTOR_STATE'];
    function config($stateProvider,INSTRUCTOR_STATE){
      // If user goes to a path that doesn't exist, redirect to public root
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
          controllerAs: 'instruHomeCtrl'
        })
        .state(INSTRUCTOR_STATE.HOME_STUDENT, {
          parent:'instructor_init',
          url: '/students',
          templateUrl: 'src/instructor/student-list/student-list.html',
          controller: 'studentListController',
          controllerAs: 'stuListCtrl'
        })
        .state(INSTRUCTOR_STATE.HOME_STUDENT_FORM, {
          url: '/:studentsName/:assignmentId',
          templateUrl: 'src/instructor/assignment-form/assignment-form.html',
          controller: 'instruAssignmentFormController',
          controllerAs: 'instructorFormCtrl',
          css:['css/viewer.css','css/pdfview.css']
        })
        .state(INSTRUCTOR_STATE.HOME_ASSIGNMENT, {
          parent:'instructor_init',
          url:'/assignments',
          templateUrl: 'src/instructor/assignment-list/assignment-list.html',
          controller: 'instrucAssignmentListController',
          controllerAs: 'instructorAssignListCtrl'
        })
        .state(INSTRUCTOR_STATE.HOME_ASSIGNMENT_CREATE, {
          url:'/create_assignment',
          templateUrl: 'src/instructor/assignment-create/assignment-create.html',
          controller: 'assignmentCreateController',
          controllerAs: 'assignCrtCtrl'
        })
        .state(INSTRUCTOR_STATE.HOME_ASSIGNMENT_FORM, {
          url:'/:studentsName/:assignmentId',
          templateUrl: 'src/instructor/assignment-form/assignment-form.html',
          controller: 'instruAssignmentFormController',
          controllerAs: 'instructorFormCtrl',
          css:['css/viewer.css','css/pdfview.css']
        })
        ;
      }

})();
