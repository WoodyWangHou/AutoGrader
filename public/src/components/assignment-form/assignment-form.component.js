(function() {
"use strict";

angular.module('autograder')
.component('assignmentForm', {
  templateUrl:'src/components/assignment-form/assignment-form.html',
  bindings:{
        afterSubmitSuccess:'<',
        afterSubmitFailed:'<',
        formId:'<',
        submitUrl:'<',
        additional:'<',
        form:'<',
        uploader:'<',
        storageFileUrl:'<',
        mainLabelFileUrl:'<',
        optionAuxLabelFileUrl:'<',
        prescriptionFileUrl:'<',
        scores:'<',
        comments:'<',
        status:'<'
  },
  controller:'formController'
})
.controller('formController',formController);

formController.$inject=['$http','PDFViewerService','$state','STUDENT_STATE','INSTRUCTOR_STATE','ajaxUploadService'];
function formController($http, pdf,$state,STUDENT_STATE,INSTRUCTOR_STATE,uploadService){
  var $ctrl = this;
      $ctrl.prescription = pdf.Instance("prescription");
      $ctrl.isInstructor = false;
      $ctrl.error = [];
      $ctrl.success = [];
    // add row function to formulation
    $ctrl.addRow = function (){
      var newRow = {
        ingredient_name:"",
        official_quantity:"",
        used_quantity:"",
        actual_quantity_weighted:"",
        signature:""
      };
      $ctrl.form.formulation.push(newRow);
    };

    // delete row function to formulation
    $ctrl.deleteRow = function(){
      if($ctrl.form.formulation){
        $ctrl.form.formulation.pop();
      }
    };

  $ctrl.pageLoaded = function(curPage, totalPages) {
    $ctrl.currentPage = curPage;
    $ctrl.totalPages = totalPages;
  };

  $ctrl.nextPage = function() {
    $ctrl.prescription.nextPage();
  };

  $ctrl.prevPage = function() {
    $ctrl.prescription.prevPage();
  };

  $ctrl.getScores = function(){
    $ctrl.totalScores = parseInt($ctrl.formulationScores||0) +
          parseInt($ctrl.calculationScores||0) +
          parseInt($ctrl.methodScores||0) +
          parseInt($ctrl.packingScores||0) +
          parseInt($ctrl.storageScores||0) +
          parseInt($ctrl.mainLabelScores||0) +
          parseInt($ctrl.auxScores||0);
    return $ctrl.totalScores;
  }

  $ctrl.$onChanges = function(changeObj){
      var evaluateMode = false;
      var viewOnlyMode = true;
      var stateName = $state.current.name;

      if(changeObj.status.currentValue){
        if(fromInstructorState(stateName)){
          $ctrl.isInstructor = true;
        }else{
          $ctrl.isInstructr = false;
        }

        switch($ctrl.status){
          case 'new':
          case 'updated':
            if(fromStudentState(stateName)){
              viewOnlyMode = false;
              evaluateMode = false;
            }
            break;
          case 'submitted':
          case 'evaluated':
            if(fromInstructorState(stateName)){
              evaluateMode = true;
              viewOnlyMode = true;
            }
            break;
          }
      }

      setModeHelper(evaluateMode,viewOnlyMode);
  }

  var fromStudentState = function(stateName){
    if((stateName.indexOf(STUDENT_STATE.HOME_ASSIGNMENT) !== -1)||
      (stateName.indexOf(STUDENT_STATE.HOME_ASSIGNMENT_FORM) !== -1)){
      return true;
    }
    return false;
  }

  var fromInstructorState = function(stateName){
    if((stateName.indexOf(INSTRUCTOR_STATE.HOME_STUDENT) !== -1) ||
      (stateName.indexOf(INSTRUCTOR_STATE.HOME_ASSIGNMENT) !== -1)){
      return true;
    }
    return false;
  }

  var setModeHelper = function(evaluateMode, viewOnlyMode){
    $ctrl.evaluateMode = evaluateMode;
    $ctrl.viewOnlyMode = viewOnlyMode;

      if(evaluateMode || viewOnlyMode){
          if($ctrl.scores){
          $ctrl.formulationScores = $ctrl.scores.formulation;
          $ctrl.calculationScores = $ctrl.scores.calculation;
          $ctrl.methodScores = $ctrl.scores.method;
          $ctrl.packingScores = $ctrl.scores.packing;
          $ctrl.storageScores = $ctrl.scores.storageLabel;
          $ctrl.mainLabelScores = $ctrl.scores.mainLabel;
          $ctrl.auxScores = $ctrl.scores.auxLabel;
          $ctrl.totalScores = $ctrl.getScores();
        }

        if($ctrl.comments){
          $ctrl.formulationComment = $ctrl.comments.formulation;
          $ctrl.calculationComment = $ctrl.comments.calculation;
          $ctrl.methodComment = $ctrl.comments.method;
          $ctrl.packingComment = $ctrl.comments.packing;
          $ctrl.storageComment = $ctrl.comments.storageLabel;
          $ctrl.mainLabelComment = $ctrl.comments.mainLabel;
          $ctrl.auxComment = $ctrl.comments.auxLabel;
        }
      }

  }

  $ctrl.$onInit = function(){
      $ctrl.info = "Please provide complete scores and submit";
      $ctrl.prescription.id = "prescription";
      $ctrl.labelHeight = "medium";
  }
  
  $ctrl.$doCheck = function(){
    $ctrl.getScores();
  }

  var isAllScoresAvailable = function(){
    return ($ctrl.formulationScores || false) &&
           ($ctrl.calculationScores || false) &&
           ($ctrl.methodScores || false) &&
           ($ctrl.packingScores || false) &&
           ($ctrl.storageScores || false) &&
           ($ctrl.mainLabelScores || false) &&
           ($ctrl.auxScores || false);
  }

  var isSignatureAvailable = function(){
    for(var i = 0;i < $ctrl.form.formulation.length;i++){
      if(!$ctrl.form.formulation[i].signature){
        return false;
      }
    }
    return true;
  }

  var submitSuccess = function(res){
    if($ctrl.afterSubmitSuccess){
      $ctrl.afterSubmitSuccess(res);
    }
    $ctrl.success.push(res.data);
  }

  var submitFailed = function(error){
      if($ctrl.afterSubmitFailed){
        $ctrl.afterSubmitSuccess(error);
      }
      $ctrl.error.push(error.data);
      if(error.data){
        $ctrl.error.push(error.data);
      }     
  }

  $ctrl.submit = function(){
    // instructor evaluation mode
    console.log($ctrl);
    if($ctrl.assignmentForm.$submitted){
      $ctrl.assignmentForm.$submitted = false; 
    }
    var submission = {};
    var signatures = [];
    // initiate submissiony
    submission = {
        scores:{
          formulation:$ctrl.formulationScores,
          calculation:$ctrl.calculationScores,
          method:$ctrl.methodScores,
          packing:$ctrl.packingScores,
          storageLabel:$ctrl.storageScores,
          mainLabel:$ctrl.mainLabelScores,
          auxLabel:$ctrl.auxScores
        },
        comments:{
          formulation:$ctrl.formulationComment,
          calculation:$ctrl.calculationComment,
          method:$ctrl.methodComment,
          packing:$ctrl.packingComment,
          storageLabel:$ctrl.storageComment,
          mainLabel:$ctrl.mainLabelComment,
          auxLabel:$ctrl.auxComment
        }
    };

    if(isAllScoresAvailable()){
      console.log('not all available');
        if($ctrl.totalScores >= 0 && $ctrl.totalScores <= 100){
          if(!$ctrl.assignmentForm.$valid){
            $ctrl.error.push("Invalid input, please check the above");
            return;
          }
        }else{
          $ctrl.error.push("Total scores should be  0 ~ 100");
          return;
        }
    }else{
      console.log('scores partially available');
      for(var score in submission.scores){
          if($ctrl.assignmentForm[score].$error.score){
            $ctrl.error.push("Invalid input, please check the above");
            return;
          }     
      }
    }

    for(var i = 0;i<$ctrl.form.formulation.length;i++){
      signatures[i] = $ctrl.form.formulation[i].signature;
    }
    submission['signatures'] = signatures;
    submission['assignment_id'] = $ctrl.formId;
    $http.post($ctrl.submitUrl,submission).then(submitSuccess,submitFailed);
    return;
  }

  var getInputData = function(isComplete){
      var data = {};
      data['formulation'] = {};
        for(var i = 0;i < $ctrl.form.formulation.length; i++){
            data['formulation'][i] = {};
            data['formulation'][i]['ingredient_name'] = $ctrl.form.formulation[i].ingredient_name;
            data['formulation'][i]['official_quantity'] = $ctrl.form.formulation[i].official_quantity;
            data['formulation'][i]['used_quantity'] = $ctrl.form.formulation[i].used_quantity;
            data['formulation'][i]['actual_quantity_weighted'] = $ctrl.form.formulation[i].actual_quantity_weighted;
        }
          data['calculation'] = $ctrl.form.calculation;
          data['method'] = $ctrl.form.method;
          data['packing'] = $ctrl.form.packing;

        if(isComplete){
          // student choose to submit assignment
          data['status'] = "submitted";
        }else{
          // student choose to save assignment
          data['status'] = "updated";
        }
    return data;
  }

  var uploadAll = function(){
  // set upload tasks if there is any file to upload
    for(var i = 0; i < $ctrl.uploader.length;i++){
      if($ctrl.uploader[i].queue.length > 0){

        $ctrl.uploader[i].onBeforeUploadItem = function(item){
          var temp = {};
            switch(this.headers.id){
              case 0:
                temp['identity']='storage';
              break;
              case 1:
                temp['identity']='mainLabel';
              break;
              case 2:
                temp['identity']='auxLabel';
              break;
            }
            temp['assignment_id'] = $ctrl.formId;
            item.formData.push(temp);
        }

        $ctrl.uploader[i].onSuccessItem = function(item, response, status, headers){
          $ctrl.success.push(response);
          console.log('upload successful',response);
        }

        $ctrl.uploader[i].onErrorItem = function(item, response, status, headers) {
          $ctrl.error.push(response);
          for(var i = 0;i<$ctrl.uploader.length;i++){
            if($ctrl.uploader[i].isUploading){
              $ctrl.uploader[i].cancelAll();
            }
          }
          console.log('upload error:',response);
        }

        $ctrl.uploader[i].uploadAll();
      }
    }
  }

  $ctrl.submitByStudent = function(isComplete){
  var data = getInputData(isComplete);
    uploadAll(); // only upload if files are selected
  var submit = uploadService.saveOrSubmitAssignment($ctrl.formId,data);
  submit.then(function(res){
    $ctrl.success.push(res.data);
  },function(error){ 
    $ctrl.success.push(error.data);
  });

  }
}

})();
