(function(){
    angular.module('instructor')
    .controller('studentListController',studentListController);

    studentListController.$inject = ['instructorInterfaceInitService','userInterfaceInitService','$state'];
    function studentListController(instructorService,userInterfaceInitService,$state) {
      var $ctrl = this;
      var ui = new UIInit();

      $ctrl.isInstructor = false;
      // userInterfaceInitService.getStudentMenu($state.current.name);
      $ctrl.username = instructorService.getName();
      $ctrl.title = ui.getListDescription();

      $ctrl.column = ui.getColumn();
      $ctrl.toState = "assignment";
      
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

            if(assignment.submission.submission_date){
              let date = new Date(assignment.submission.submission_date);
              detail['submissionDate'] = (date.getDate() + '-' + instructorService.numberToMonth(date.getMonth()) + '-' + date.getFullYear());
            }
            students[i].detail.push(detail);
          }
        }
      }

      var getStudentListSuccess = function(res){
        if(res.data){
          $ctrl.studentList = res.data;
        }
        getDetails($ctrl.studentList);
      }
    
      var getStudentListFailed = function(res){
          switch(res.status){
            case 400:
            case 403:
            case 401:
            $state.go('login.form');
          }
      }
      var studentList = instructorService.getStudents();


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
