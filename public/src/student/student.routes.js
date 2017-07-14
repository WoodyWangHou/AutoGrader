(function(){
'use strict'

    angular.module('student')
    .config(config);

    config.$inject=['$stateProvider','STUDENT_STATE'];
    function config($stateProvider,STUDENT_STATE){
      // If user goes to a path that doesn't exist, redirect to public root

      $stateProvider
        .state('init',{
          abstract:true,
          url:'/student',
          templateUrl:'src/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'dbCtrl'
        })
        .state(STUDENT_STATE.HOME, {
          parent:'init',
          url:'/home',
          templateUrl: 'src/student/home-main/home-main.html',
          controller: 'homeController',
          controllerAs: 'homeCtrl'
        })
        .state(STUDENT_STATE.HOME_ASSIGNMENT, {
          parent:'init',
          url: '/assignment',
          templateUrl: 'src/student/assignment/assignment.html',
          controller: 'assignmentController',
          controllerAs: 'assignmentCtrl'
        })
        .state(STUDENT_STATE.HOME_ASSIGNMENT_FORM, {
          url: '/:assignmentName/:assignmentId',
          templateUrl: 'src/student/assignment/assignment-form/assignment-form.html',
          controller: 'assignmentFormController',
          controllerAs: 'formCtrl',
          css:['css/viewer.css','css/pdfview.css']
        });
      }

})();
