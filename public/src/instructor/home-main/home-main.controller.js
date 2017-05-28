(function(){
    angular.module('instructor')
    .controller('instruHomeController',instruHomeController);

    instruHomeController.$inject = ['instructorInterfaceInitService'];
    function instruHomeController(instructorInterfaceInitService) {
      var $ctrl = this;

      $ctrl.actionBox = instructorInterfaceInitService.getActionBox();
      $ctrl.toDoList = instructorInterfaceInitService.getRecentStudentSubmission();
      $ctrl.toDoListTitle = $ctrl.toDoList.title;
      delete $ctrl.toDoList.title;

      $ctrl.progress = instructorInterfaceInitService.getSubmissionProgress();
  }
})();
