(function(){
'use strict'

  angular.module('instructor')
  .controller('instruAssignmentFormController',instruAssignmentFormController);

  instruAssignmentFormController.$inject =[
  '$state',
  '$stateParams',
  'userInterfaceInitService',
  'instructorInterfaceInitService',
  'ajaxUploadService',
  'REMOTE_SERVER'];
  function instruAssignmentFormController(
    $state,
    $stateParams,
    userInterfaceInitService,
    instructorInterfaceInitService,
    ajaxUploadService,
    REMOTE_SERVER){

    var $ctrl = this;

    $ctrl.assignmentId = $stateParams.assignmentId;
    var urlFormatter = ajaxUploadService.urlFormatter();

    $ctrl.submitUrl = instructorInterfaceInitService.evaluationSubmitUrl();
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
        let submission = response.submission;
        let student = response.student;
        let template = response.template;
        $ctrl.prescriptionFileUrl = urlFormatter(template.prescription_url);
        $ctrl.storageFileUrl = urlFormatter(submission.storage);     
        $ctrl.mainLabelFileUrl = urlFormatter(submission.main);
        $ctrl.optionAuxLabelFileUrl = urlFormatter(submission.Auxiliary);
        // console.log('the response:',res);
        $ctrl.additional = template.additional_material;
        $ctrl.form = submission;
        if(submission.evaluation){
          $ctrl.scores = submission.evaluation.scores;
          $ctrl.comments = submission.evaluation.comments;
        }
        $ctrl.status = submission.status;
      },function(error){
        errorHandler(error);
      });
    }
  }

})();
