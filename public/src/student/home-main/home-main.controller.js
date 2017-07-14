(function(){
    angular.module('student')
    .controller('homeController',homeController);

    homeController.$inject = ['userInterfaceInitService'];
    function homeController(userInterfaceInitService) {
      var $ctrl = this;

      $ctrl.actionBox = userInterfaceInitService.getActionBox();
      $ctrl.toDoList = [];
      $ctrl.progressTable = [];
      $ctrl.progressTableTitle = "previous assignment ";
      $ctrl.listTitle = "Pending Assignments"
      var assignmentList = userInterfaceInitService.getStudentAssignment();

      // $ctrl.progress = userInterfaceInitService.getProgress();

      var elapsedDates = function(date){
        let mil = Date.parse(date);
        let elapsed = Date.now() - mil;

        elapsed = parseInt(elapsed / (1000*60*60*24));
        return elapsed;
      }

      var setListTable = function(response){
              for(var i = 0; i <response.length;i++){
                let submission = response[i].submission;
                let template = response[i].template;
                let student = response[i].student;

                if(submission && template && student){
                    if((submission.status !== 'submitted') && (submission.status !== 'evaluated')){
                    let student = response[i].student;

                        var item = {
                          name:template.assignment_name,
                          description:template.description,
                          $studentName:student.username,
                          $assignmentId:response[i]._id
                        };

                        if(template.deadline){
                          let date = new Date(template.deadline);
                          let elapsed = elapsedDates(date);
                          item['date'] = date.getDate() + "-"+ (date.getMonth() + 1) + "-" + date.getFullYear();

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
                }   
              }
      }

      var setProgressTable = function(response){
        for(var i = 0;i<response.length;i++){
            let submission = response[i].submission;
            let template = response[i].template;
            let student = response[i].student;

        if(submission && template && student){
            if(submission.status === 'evaluated'){
                
                    let scores = 0.0;
                    let totalScores = 100.0;

                    for(var score in submission.evaluation){
                        scores += submission.evaluation[score] * 1.0;
                    }
                    let percent = scores/totalScores;
                    let row = {
                        rowTitle:template.assignment_name,
                        value:scores,
                        totalValue:totalScores,
                        percent:percent
                    };

                    $ctrl.progressTable.push(row);
                }
            }
        }

        if($ctrl.progressTable.length === 0){
            $ctrl.info = "You do not have any assignment evaluated";
        }
      }

      $ctrl.$onInit = function(){
        $ctrl.isInstructor = false;

        assignmentList.then(function(res){
            if(res.data){
              var response = res.data;
              setListTable(response);
              setProgressTable(response);
            }
            
            if($ctrl.toDoList.length === 0){
                $ctrl.defaultText ="You have no pending assignment！";
            }

        },function(error){
            console.log('error occurs',error.data);
        });
      }
    }

})();
