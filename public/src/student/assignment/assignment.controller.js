(function(){
'use strict'

  angular.module('student')
  .controller('assignmentController',assignmentController);

  assignmentController.$inject =['$state','userInterfaceInitService','instructorInterfaceInitService'];
  function assignmentController($state,userInterfaceInitService,instructorService){
    var $ctrl = this;
    $ctrl.assignmentDetail = [];
    $ctrl.isInstructor = false;
    // userInterfaceInitService.getStudentMenu($state.current.name);
    $ctrl.username = userInterfaceInitService.getName();
    $ctrl.title = userInterfaceInitService.getTitle();
    $ctrl.toState = "student";

    $ctrl.column = ["Assignment Name","Description","Submission Date","Deadline","Status"];
    var detail = userInterfaceInitService.getStudentAssignment();

    $ctrl.$onInit = function(){
      detail.then(function(res){
            if(res.data){
              var response = res.data;
              $ctrl.detail = [];

              for(var i = 0; i < response.length;i++){
                let assignment = response[i].template;
                let submission = response[i].submission;
                let student = response[i].student;
                let deadline = new Date(assignment.deadline);
                if(assignment && submission && student){
                  let item = {
                    assignmentName:assignment.assignment_name,
                    description:assignment.description,
                    submissionDate:'N/A',
                    deadline:deadline.getDate() + '-' + instructorService.numberToMonth(deadline.getMonth()) + '-' + deadline.getFullYear(),
                    status:submission.status || 'N/A',
                    $name:assignment.assignment_name,
                    $id:response[i]._id
                  };
                  if(submission.submission_date){
                    let date = new Date(submission.submission_date);
                    item['submissionDate'] = (date.getDate() + '-' + instructorService.numberToMonth(date.getMonth()) + '-' + date.getFullYear());
                  }
                  $ctrl.detail.push(item);
                }
              }
            }else{
              $ctrl.detail = "You do not have any assignment yet";
            }
          },function(error){
            console.log(error);
          });
    }
  }

})();
