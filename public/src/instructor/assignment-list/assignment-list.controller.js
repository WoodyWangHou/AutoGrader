(function(){
    angular.module('instructor')
    .controller('instrucAssignmentListController',instrucAssignmentListController);

    instrucAssignmentListController.$inject = ['instructorInterfaceInitService','userInterfaceInitService','$stateParams'];
    function instrucAssignmentListController(instructorInterfaceInitService,userInterfaceInitService,$stateParams) {
      var $ctrl = this;
      var ui = new UIInit();

      $ctrl.isInstructor = true;

      $ctrl.name = instructorInterfaceInitService.getName();
      $ctrl.title = ui.getListDescription();
      $ctrl.column = ui.getColumn();
      $ctrl.detail ={};

      var assignmentList = instructorInterfaceInitService.getAllAssignmentNames();

      var numberToMonth = function(number){
        if(number>0 && number<12){
          let months = ["January","February","March","April","May","June","July",
          "August","September","October","November","December"];

          return months[number-1];
        }else{
          return number;
        }
      }

      var assignment_mapping = function(target,source){
        console.log('the list is:',source);
        for(var i = 0;i<source.length;i++){
          var temp = {};
          for(var field in source[i]){
            
            if(field.indexOf('name')!== -1){
              temp.name = source[i][field];
            }else if(field.indexOf('description')!== -1){
              temp.description = source[i][field];
            }else if(field.indexOf('deadline')!== -1){
              var date = new Date(source[i][field]);
              var str = date.getDate() + '-' + numberToMonth(date.getMonth()) + '-' + date.getFullYear();
              temp.deadline = str;
            }
            temp.assignmentId = source[i]._id;
          }
          target.push(temp);
        }
      }

      var getStudentsNames = function(){
          for(var i = 0;i<$ctrl.assignments.length;i++){
            var student = instructorInterfaceInitService.getAllStudentsByAssignments($ctrl.assignments[i].assignmentId);
            (function(student,index){
              student.then((res)=>{
               $ctrl.assignments[index].students = res.data;
               // console.log(res.data);
              $ctrl.assignments[index]['detail'] = [];
              for(var j=0;j<$ctrl.assignments[index].students.length;j++){
                var student = $ctrl.assignments[index].students[j].student;
                var submit = $ctrl.assignments[index].students[j].submission;
                var temp = {
                  username:student.username,
                  name:student.first_name+' '+student.last_name,
                  submissionDate:submit.submissionDate ||'N/A',
                  status_scores:submit.socres || submit.status || 'N/A',
                  $name:student.first_name+' '+student.last_name,
                  $id:$ctrl.assignments[index].students[j].submission.assignment
                };
                $ctrl.assignments[index]['detail'].push(temp);
              }

              },getStudentsNamesFail);
            })(student,i);
          }
      }

      var getStudentsNamesFail = function(res){
        console.log('Get student names failed:',res.data);
      }

      var getAssignmentListSuccess = function(res){
        if(res.data){
          $ctrl.assignments = [];
          assignment_mapping($ctrl.assignments,res.data);
          console.log('$ctrl.assignments is:',$ctrl.assignments);

          getStudentsNames();
        }
      }

      var getAssignmentListFail = function(res){
        console.log('Failed:',res.data);
      }

      $ctrl.$onInit = function(){
        assignmentList.then(getAssignmentListSuccess,getAssignmentListFail);
        // console.log($ctrl.assignments);
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
