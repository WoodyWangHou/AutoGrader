(function(){
    angular.module('instructor')
    .controller('instrucAssignmentListController',instrucAssignmentListController);

    instrucAssignmentListController.$inject = [
    'instructorInterfaceInitService',
    'userInterfaceInitService',
    '$stateParams',
    'ajaxUploadService',
    '$state'];
    function instrucAssignmentListController(
      instructorService,
      userInterfaceInitService,
      $stateParams,
      uploadService,
      $state) {
      var $ctrl = this;
      var ui = new UIInit();

      $ctrl.isInstructor = true;

      $ctrl.name = instructorService.getName();
      $ctrl.title = ui.getListDescription();
      $ctrl.column = ui.getColumn();
      $ctrl.detail ={};
      $ctrl.toState = "instructor";

      var assignmentList = instructorService.getAllAssignmentNames();

      var assignment_mapping = function(target,source){
        for(var i = 0;i<source.length;i++){
          var temp = {};
          for(var field in source[i]){
            
            if(field.indexOf('name')!== -1){
              temp.name = source[i][field];
            }else if(field.indexOf('description')!== -1){
              temp.description = source[i][field];
            }else if(field.indexOf('deadline')!== -1){
              var date = new Date(source[i][field]);
              var str = date.getDate() + '-' + instructorService.numberToMonth(date.getMonth()) + '-' + date.getFullYear();
              temp.deadline = str;
            }
            temp.templateId = source[i]._id;
          }
          target.push(temp);
        }
      }

      var getStudentsNames = function(){
          for(var i = 0;i<$ctrl.assignments.length;i++){
            var student = instructorService.getAllStudentsByAssignments($ctrl.assignments[i].templateId);
            (function(student,index){
              student.then((res)=>{
                $ctrl.assignments[index].students = res.data;
                $ctrl.assignments[index]['detail'] = [];
                for(var j=0;j<$ctrl.assignments[index].students.length;j++){
                  var student = $ctrl.assignments[index].students[j].student;
                  var submit = $ctrl.assignments[index].students[j].submission;

                  var temp = {
                    username:student.username,
                    name:student.first_name+' '+student.last_name,
                    submissionDate:submit.submission_date || 'N/A',
                    status_scores:submit.scores || submit.status || 'N/A',
                    $name:student.first_name+' '+student.last_name,
                    $id:$ctrl.assignments[index].students[j].submission.assignment
                  };

                  if(submit.submission_date){
                    var date = new Date(submit.submission_date);
                    temp['submissionDate'] = (date.getDate() + '-' + instructorService.numberToMonth(date.getMonth()) + '-' + date.getFullYear());
                  }
                  $ctrl.assignments[index]['detail'].push(temp);
                }

              },getStudentsNamesFail);
            })(student,i);
          }
      }

      var getStudentsNamesFail = function(res){
        console.log('Get student names failed:',res.data);
      }

      $ctrl.deleteAssignment = function(template_id){
        var deletetask = uploadService.deleteTemplateById(template_id);
        deletetask.then(function(res){
          $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
          });
        },function(err){
          console.log(err.data);
        });
      }

      $ctrl.$onInit = function(){
        assignmentList.then(function(res){
          if(res.data){
            $ctrl.assignments = [];
            assignment_mapping($ctrl.assignments,res.data);

            getStudentsNames();
          }
        },function(res){
          console.log('Failed:',res.data);
        });
        
      }

      $ctrl.$onChanges = function(){
        console.log('$ctrl.assignments:',$ctrl.assignments);
      }
  }

  function UIInit(){
    this.getColumn = function(){
        return ["Matric Number","Name","Submission Date","Status(Scores)"];
    }
    this.getListDescription = function(){
      return "submission";
    }
  }
})();
