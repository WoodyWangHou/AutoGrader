(function(){
    angular.module('student')
    .controller('homeController',homeController);

    homeController.$inject = ['userInterfaceInitService'];
    function homeController(userInterfaceInitService) {
      var $ctrl = this;

      $ctrl.actionBox = userInterfaceInitService.getActionBox();
      $ctrl.toDoList = userInterfaceInitService.getStudentAssignmentById();
      var total = $ctrl.toDoList.length;
      var newAssign = 0;
      var progress = 0;
      var submitted = 0;
      var evaluated = 0;

      for(var i = 0; i < $ctrl.toDoList.length; i++){
        if($ctrl.toDoList[i].scores && $ctrl.toDoList[i].scores>0) evaluate++;
        else if($ctrl.toDoList[i].submissionDate) submitted++;
        else if($ctrl.toDoList[i].inProgress) {progress++;}
        else newAssign++;
      }
      $ctrl.progress = {
        title:"Progress",
        row1:"New Assignments",
        item1:(newAssign/total)*100,
        row2:"In Progress",
        item2:(progress/total)*100,
        row3:"Submitted",
        item3:(submitted/total)*100,
        row4:"Evaluated",
        item4:(evaluated/total)*100,
        row1Length:newAssign,
        row2Length:progress,
        row3Length:submitted,
        row4Length:evaluated
      };
    }

})();
