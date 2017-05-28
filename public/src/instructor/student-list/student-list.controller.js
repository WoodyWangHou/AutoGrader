(function(){
    angular.module('instructor')
    .controller('studentListController',studentListController);

    studentListController.$inject = ['instructorInterfaceInitService','userInterfaceInitService'];
    function studentListController(instructorInterfaceInitService,userInterfaceInitService) {
      var $ctrl = this;
      var ui = new UIInit();

      $ctrl.assignmentDetail = [];
      $ctrl.isInstructor = true;
      // userInterfaceInitService.getStudentMenu($state.current.name);
      $ctrl.username = instructorInterfaceInitService.getName();
      $ctrl.title = ui.getListDescription();

      $ctrl.column = ui.getColumn();
      $ctrl.studentList = instructorInterfaceInitService.getStudents();

      for(var student in $ctrl.studentList){
        $ctrl.studentList[student].assignmentList = userInterfaceInitService.getStudentAssignmentById(
          $ctrl.studentList[student].matricNumber);
      }
  }

  function UIInit(){
    this.getColumn = function(){
        return ["Assignment Name","Description","Submission Date","Status"];
    }
    this.getListDescription = function(){
      return "Assignments";
    }
  }
})();
