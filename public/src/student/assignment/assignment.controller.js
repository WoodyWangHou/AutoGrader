(function(){
'use strict'

  angular.module('student')
  .controller('assignmentController',assignmentController);

  assignmentController.$inject =['$state','userInterfaceInitService'];
  function assignmentController($state,userInterfaceInitService){
    var $ctrl = this;
    $ctrl.assignmentDetail = [];
    $ctrl.isInstructor = false;
    // userInterfaceInitService.getStudentMenu($state.current.name);
    $ctrl.username = userInterfaceInitService.getName();
    $ctrl.title = userInterfaceInitService.getTitle();

    $ctrl.column = ["Assignment Name","Description","Deadline","Status"];
    $ctrl.detail = userInterfaceInitService.getStudentAssignmentById('A0078679B');
  }

})();
