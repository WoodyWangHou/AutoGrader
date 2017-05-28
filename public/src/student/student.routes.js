(function(){
'use strict'

    angular.module('student')
    .config(config);

    config.$inject=['$stateProvider','STUDENT_STATE'];
    function config($stateProvider,STUDENT_STATE){
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
        .state('init',{
          abstract:true,
          templateUrl:'src/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'dbCtrl'
        })
        .state(STUDENT_STATE.HOME, {
          parent:'init',
          url:'/student',
          templateUrl: 'src/student/home-main/home-main.html',
          controller: 'homeController',
          controllerAs: 'homeCtrl',
          css:cssList
        })
        .state(STUDENT_STATE.HOME_ASSIGNMENT, {
          parent:'init',
          url: '/assignment',
          templateUrl: 'src/student/assignment/assignment.html',
          controller: 'assignmentController',
          controllerAs: 'assignmentCtrl',
          css:cssList
        })
        .state(STUDENT_STATE.HOME_ASSIGNMENT_FORM, {
          url: '/:assignmentId',
          templateUrl: 'src/student/assignment/assignment-form/assignment-form.html',
          controller: 'assignmentFormController',
          controllerAs: 'formCtrl',
          css:cssList
        });
        // .state(STUDENT_STATE.HOME_MATERIALS, {
        //   parent:'init',
        //   url: '/materials',
        //   templateUrl: 'src/student/materials/materials.html',
        //   controller: 'materialController',
        //   controllerAs: 'materialCtrl',
        //   css:cssList
        //   // to be updated
        // })
        // .state(STUDENT_STATE.HOME_FEEDBACK, {
        //   parent:'init',
        //   url: '/feedback',
        //   templateUrl: 'src/student/assignment/assignment.html',
        //   controller: 'feedbackController',
        //   controllerAs: 'feedbackCtrl',
        //   css:cssList
        //   // to be updated
        // })
      }

})();
