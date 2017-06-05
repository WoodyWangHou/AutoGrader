(function(){
'use strict'

  angular.module('instructor')
  .controller('assignmentCreateController',assignmentCreateController);

  const MAIN_LABEL = 1;
  const AUX_LABEL = 2;
  const STORAGE = 3;

  assignmentCreateController.$inject =['$state','$stateParams','instructorInterfaceInitService','ajaxUploadService'];
  function assignmentCreateController($state,$stateParams,instructorInterfaceInitService,ajaxUploadService){

    var $ctrl = this;
    $ctrl.additionalMaterial = "";

    // config file uploader
    $ctrl.uploader = ajaxUploadService.getAssignmentFileUploader();
    $ctrl.uploader.queueLimit = 2;

    // config check box
    var ui = new UIinit();
    $ctrl.headTitle = ui.getStudentListTitle();

    $ctrl.columnTitle=ui.getColumnTitle();

    var temp=instructorInterfaceInitService.getStudents();

    var students = [];
    for(var i =0;i<temp.length;i++){
        var str = [];
      for(var attri in temp[i]){
        str.push(temp[i][attri]);
      }
      students.push(str);
    }
    $ctrl.students = students;

    $ctrl.uploader.onAfterAddingFile = function(item){
      var temp = item;
      var alias = item.alias;
      for(var i =0;i<$ctrl.uploader.queue.length;i++){
        if($ctrl.uploader.queue[i].alias == alias){
          if($ctrl.uploader.queue[i] != item){
            $ctrl.uploader.removeFromQueue(i);
          }
        }
      }
    };
  }

  var UIinit = function(){
    var ui = this;

    ui.getStudentListTitle = function(){
      return  "Choose Students";
    }

    ui.getColumnTitle = function(){
      var title = ["Matric Number", "Name"];
      return title;
    }
  }

})();
