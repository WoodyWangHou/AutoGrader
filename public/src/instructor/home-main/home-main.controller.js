(function(){
    angular.module('instructor')
    .controller('instruHomeController',instruHomeController);

    instruHomeController.$inject = ['instructorInterfaceInitService'];
    function instruHomeController(instructorInterfaceInitService) {
      var $ctrl = this;

      $ctrl.actionBox = instructorInterfaceInitService.getActionBox();
      var pendingSubmission = instructorInterfaceInitService.getRecentStudentSubmission();
      $ctrl.toDoListTitle = "Recent Student Submission";
      $ctrl.isInstructor = true;

      var elapsedDates = function(date){
        let mil = Date.parse(date);
        let elapsed = Date.now() - mil;

        elapsed = parseInt(elapsed / (1000*60*60*24));
        return elapsed;
      }

      var set

      $ctrl.$onInit = function(){
          pendingSubmission.then(function(res){
            if(res.data){
              var response = res.data;
              $ctrl.toDoList = [];
              for(var i = 0; i <response.length;i++){
                let student = response[i].assignment.student;

                var item = {
                  name:student.username + " - " + student.first_name + " " + student.last_name,
                  description:response[i].assignment.template.assignment_name,
                  $studentName:student.username,
                  $assignmentId:response[i].assignment._id
                };

                if(response[i].submission_date){
                  let date = new Date(response[i].submission_date);
                  let elapsed = elapsedDates(date);
                  item['date'] = date.getUTCDate() + "-"+ (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear();

                  if(elapsed < 3){
                    item['dateTag'] = 'success';
                  }else if(elapsed > 3 && elapsed < 7){
                    item['dateTag'] = 'warning';
                  }else{
                    item['dateTag'] = 'important';
                  }
                }
                $ctrl.toDoList.push(item);
              }
            }else{
              $ctrl.toDoList = {
                description:"Currently there is no pending submission to be evaluated!"
              };
            }
          },function(error){
            console.log(error);
          });
      }
  }
})();
