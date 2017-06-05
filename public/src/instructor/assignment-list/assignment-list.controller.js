(function(){
    angular.module('instructor')
    .controller('instrucAssignmentListController',instrucAssignmentListController);

    instrucAssignmentListController.$inject = ['instructorInterfaceInitService','userInterfaceInitService','$stateParams'];
    function instrucAssignmentListController(instructorInterfaceInitService,userInterfaceInitService,$stateParams) {
      var $ctrl = this;
      var ui = new UIInit();

      $ctrl.detail = [];
      $ctrl.isInstructor = true;

      $ctrl.name = instructorInterfaceInitService.getName();
      $ctrl.title = ui.getListDescription();
      $ctrl.column = ui.getColumn();

      $ctrl.assignments = instructorInterfaceInitService.getAllAssignmentNames();

      for(var i=0;i<$ctrl.assignments.length;i++){
        $ctrl.assignments[i].students = instructorInterfaceInitService.getStudentsByAssignmentId(
          $ctrl.assignments[i].assignmentGroupId);
      }
  }

  function UIInit(){
    this.getColumn = function(){
        return ["Matric Number","Name","Submission Date","Scores"];
    }
    this.getListDescription = function(){
      return "submission";
    }
  }
})();
