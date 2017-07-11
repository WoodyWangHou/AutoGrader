(function(){
'use strict'

  angular.module('instructor')
  .controller('instruAssignmentFormController',instruAssignmentFormController);

  const MAIN_LABEL = 1;
  const AUX_LABEL = 2;
  const STORAGE = 3;

  instruAssignmentFormController.$inject =[
  '$state',
  '$stateParams',
  'userInterfaceInitService',
  'instructorInterfaceInitService',
  'ajaxUploadService'];
  function instruAssignmentFormController(
    $state,
    $stateParams,
    userInterfaceInitService,
    instructorInterfaceInitService,
    ajaxUploadService){

    var $ctrl = this;
    var init = new UIinit();

    $ctrl.instructor = true;
    $ctrl.assignmentId = $stateParams.assignmentId;
    // config file uploader
    $ctrl.uploader = ajaxUploadService.getAssignmentFileUploader();
    $ctrl.uploader.queueLimit = 2;

    $ctrl.submitUrl = instructorInterfaceInitService.evaluationSubmitUrl();
    $ctrl.mode = {
      viewOnlyMode:true,
      evaluateMode:true
    };

    var assignment = instructorInterfaceInitService.getAssignmentById($ctrl.assignmentId);

    var errorHandler = function(error){
      $ctrl.error = error.status + " " + error.data;
      if(error.data){
        $ctrl.error += error.data;
      }
    }

    $ctrl.$onInit = function(){
      assignment.then(function(res){
        var response = res.data;
        console.log('the response:',res);
        $ctrl.additional = response.template.additional_material;
        $ctrl.form = response.submission;
        $ctrl.scores = response.submission.evaluation.scores;
        $ctrl.comments = response.submission.evaluation.comments;
      },function(error){
        errorHandler(error);
      });
    }

    // add row function to formulation
    $ctrl.addRow = function(){
      $ctrl.form.formulation.push(init.getNewRow());
    };
    // delete row function to formulation
    $ctrl.deleteRow = function(){
        if($ctrl.form.formulation){
          $ctrl.form.formulation.pop();
        }
    };

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

  function UIinit(state){
    var init = this;

    init.setForm = function(){
      return {
          formulation:[],
          // plain text
          calculation:"Enter text...",
          method:"Enter text...",
          packing:"Enter text...",
          // url
          storage:"",
          mainLabel:"",
          auxiliaryLabel:""
      };
    };

    init.getNewRow = function(){
      var newRow = {
        ingredient:"",
        quantity:0,
        used:0,
        actual:0
      };
      return newRow;
    };
  }

})();
