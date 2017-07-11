(function(){
    angular.module('instructor')
    .controller('studentListController',studentListController);

    studentListController.$inject = ['instructorInterfaceInitService','userInterfaceInitService'];
    function studentListController(instructorInterfaceInitService,userInterfaceInitService) {
      var $ctrl = this;
      var ui = new UIInit();

      $ctrl.isInstructor = false;
      // userInterfaceInitService.getStudentMenu($state.current.name);
      $ctrl.username = instructorInterfaceInitService.getName();
      $ctrl.title = ui.getListDescription();

      $ctrl.column = ui.getColumn();
      
      var getDetails = function(students){

        for(var i = 0;i<students.length;i++){
          students[i].detail = [];
          for(var j = 0;j<students[i].assignments.length;j++){
            let assignment = students[i].assignments[j];
            let detail = {
              assignmentName:assignment.template.assignment_name,
              description:assignment.template.description,
              submissionDate:assignment.submission.submission_date || 'N/A',
              status:assignment.submission.status || 'N/A',
              $name:students[i].first_name+' '+students[i].last_name,
              $id:assignment._id
            };
            students[i].detail.push(detail);
          }
        }
      }

      var getStudentListSuccess = function(res){
        if(res.data){
          $ctrl.studentList = res.data;
        }
        console.log('response:',res.data);
        getDetails($ctrl.studentList);
      }
    
      var getStudentListFailed = function(res){
        console.log("Failed: ",res);
      }
      var studentList = instructorInterfaceInitService.getStudents();


      $ctrl.$onInit = function(){
          studentList.then(getStudentListSuccess,getStudentListFailed);
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
