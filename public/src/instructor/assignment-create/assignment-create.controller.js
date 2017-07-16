(function(){
'use strict'

  angular.module('instructor')
  .controller('assignmentCreateController',assignmentCreateController);

  assignmentCreateController.$inject =[
  '$state',
  '$stateParams',
  'instructorInterfaceInitService',
  'ajaxUploadService',
  '$element'];
  function assignmentCreateController(
    $state,
    $stateParams,
    instructorInterfaceInitService,
    ajaxUploadService,
    $element){

    var validFileTypes = ['application/pdf','image/*'];
    var $ctrl = this;

    var getStudentListSuccess = function(res){
      if(res.data){
        var students = getMatricAndName(res.data);
        $ctrl.students = students;
      }
    }
    
    var getStudentListFailed = function(res){
      $ctrl.error.push(res.data);
    }

    var studentComparator = function(a,b){
        if (a.matric_number > b.matric_number) return 1;
        if (a.matric_number == b.matric_number) return 0;
        if (a.matric_number < b.matric_number) return -1;
    }
    var getMatricAndName = function(li){
      var endList = {}
      endList.student = [];
      for(var i =0;i<li.length;i++){
        var temp={};
        for(var key in li[i]){
          if(key == 'username' ){
            temp.matric_number = li[i][key];
          }else if (key == 'first_name'){
            temp.first_name = li[i][key];
          }else if (key == 'last_name'){
            temp.last_name = li[i][key];
          }else if (key == 'enrollment_year'){
            temp.enrollment_year = li[i][key];
          }
        }
          if(temp.first_name){
            if(temp.last_name){
              temp.name = temp.first_name + " " + temp.last_name;
              delete temp.first_name;
              delete temp.last_name;
            }else{
              temp.name = temp.first_name;
              delete temp.first_name;
            }
            endList.student.push(temp);
          }else{
            if(temp.last_name){
              temp.name = temp.last_name;
              delete temp.last_name;
              endList.student.push(temp);
            }
        }
     }
      endList.student.sort(studentComparator);
      return endList.student;
    }

    var searchStudent = function(matric_number){
      for(var i = 0;i<$ctrl.students.length;i++){
        if($ctrl.students[i].matric_number === matric_number){
          return $ctrl.students[i];
        }
      }
    }

    // config check box
    var ui = new UIinit();
    $ctrl.headTitle = ui.getStudentListTitle();
    $ctrl.columnTitle=ui.getColumnTitle();

    /**set the infomation**/
    $ctrl.info = "* fields are required, click title to expand";
    $ctrl.additional_material = "";
    $ctrl.assignment_name = "";
    $ctrl.assignment_description ="";
    $ctrl.deadline="";
    $ctrl.selectedStudents = [];//array holding the selected students value
    $ctrl.selected=[];
    $ctrl.isSelected = false;
    $ctrl.isFileSelected = false;
    $ctrl.submitted = false;
    $ctrl.isUploading = false;
    $ctrl.success = [];
    $ctrl.error = [];
    // set date picker
    ui.setDatepicker($element);

    // config file uploader
    $ctrl.validFile = true;
    // student list section
    var studentList=instructorInterfaceInitService.getStudents();
    
    // get students
    $ctrl.$onInit = function(){
      $ctrl.uploader = ajaxUploadService.getAssignmentFileUploader();
      $ctrl.uploader.onAfterAddingFile = function(item){
      if ($ctrl.uploader.queue.length > 1) {
        $ctrl.uploader.queue.splice(0, 1);
      }
      $ctrl.isFileSelected = true;
      $ctrl.validateUpload();
    }

    $ctrl.uploader.onSuccessItem = function(item, response, status, headers){
      $ctrl.success.push(response);
      $ctrl.isUploading = false;
    }

    $ctrl.uploader.onErrorItem = function(item, response, status, headers) {
      $ctrl.error.push(status.toString);
      $ctrl.error.push("Please check your connection and file");
      $ctrl.isUploading = false;
      $ctrl.uploader.cancellAll();
    }

    $ctrl.uploader.onBeforeUploadItem = function(item){
      var data = {};
      var counter = 0;
      for(var student in $ctrl.selectedStudents){
        data['selectedStudents'+counter+'matric_number'] = $ctrl.selectedStudents[student].matric_number;
        data['selectedStudents'+counter+'name'] = $ctrl.selectedStudents[student].name;
        counter++;
      }
      data.assignment_name = $ctrl.assignment_name;
      data.assignment_description=$ctrl.assignment_description;
      data.additional_material=$ctrl.additional_material;
      data.deadline = $ctrl.deadline;
      item.formData.push(data);
    }
      studentList.then(getStudentListSuccess,getStudentListFailed);
    }

    $ctrl.getSelectedStudents = function(matric_number,is_selected){
      if(is_selected){
        var student = searchStudent(matric_number);
        $ctrl.selectedStudents.push(student);
        $ctrl.isSelected = true;
      }else{
        for(var i = 0; i<$ctrl.selectedStudents.length;i++){
            if($ctrl.selectedStudents[i].matric_number == matric_number){
              var removed = $ctrl.selectedStudents.splice(i,1);
            }
          }
        if($ctrl.selectedStudents.length === 0){
         $ctrl.isSelected = false;
        }
      }
    }

    $ctrl.submit = function(){
      if($ctrl.validFile && $ctrl.isFileSelected && $ctrl.isSelected && $ctrl.form.$valid){
         $ctrl.isUploading = true;
         return $ctrl.uploader.uploadAll();
      }
        $ctrl.isUploading = false;
  
  }

    var isValidType = function(acceptTypes,fileType){
      var typeCatExt = [];
      var fileCat = (fileType.split('/'))[0];
      var fileExt = (fileType.split('/'))[1];

      for(var i = 0; i<acceptTypes.length;i++){
        typeCatExt.push(acceptTypes[i].split('/'));
      }

      for(var i = 0;i<typeCatExt.length;i++){
        if(typeCatExt[i][1] === '*'){
          if(typeCatExt[i][0] === fileCat){
            return true;
          }
        }else{
          if(typeCatExt[i][1] === fileExt){
            return true;
          }else{
            return false;
          }
        }
      }
      return false;
    }

    $ctrl.validateUpload = function(){
      if($ctrl.uploader.queue){
        for(var i = 0; i <validFileTypes.length;i++){
          if(isValidType(validFileTypes,$ctrl.uploader.queue[0].file.type)){
            return $ctrl.validFile = true;
          }else{
            $ctrl.validFile = false;
          }
        }
      }else{
        $ctrl.validFile = false; // no file selected
      }
    }
  } // end of controller

  var UIinit = function(){
    var ui = this;

    ui.getStudentListTitle = function(){
      return  "Choose Students";
    }

    ui.getColumnTitle = function(){
      var title = ["Matric Number", "Enrollment Year","Name"];
      return title;
    }

    ui.setDatepicker = function(element){
      element.find(".input-append.date").datepicker({
        format: 'dd/mm/yyyy',
        autoclose:true
      });
    }
  }

})();
