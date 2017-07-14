(function(){
'use strict'

  angular.module('student')
  .controller('assignmentFormController',assignmentFormController);

  assignmentFormController.$inject =['$state','$stateParams','userInterfaceInitService','ajaxUploadService','REMOTE_SERVER'];
  function assignmentFormController($state,$stateParams,userInterfaceInitService,ajaxUploadService,REMOTE_SERVER){
    var $ctrl = this;
    $ctrl.assignmentId = $stateParams.assignmentId;
    var detail = userInterfaceInitService.getAssignmentById($ctrl.assignmentId);
    // config file uploader
    $ctrl.uploader = [];

    var urlFormatter = ajaxUploadService.urlFormatter();

    $ctrl.$onInit = function(){
      for(var i = 0; i < 3;i++){
        var uploader = ajaxUploadService.getStudentAssignmentUploader(i);
        uploader.queueLimit = 2;
        uploader.onAfterAddingFile = function(item){
          if (this.queue.length > 1) {
            this.queue.splice(0, 1);
          }
        }
        $ctrl.uploader.push(uploader);
      }

      detail.then(function(res){
        let response = res.data
        let submission = response.submission;
        let student = response.student;
        let template = response.template;
        
        $ctrl.prescriptionFileUrl = urlFormatter(template.prescription_url);
        $ctrl.storageFileUrl = urlFormatter(submission.storage);     
        $ctrl.mainLabelFileUrl = urlFormatter(submission.main);
        $ctrl.optionAuxLabelFileUrl = urlFormatter(submission.Auxiliary);

        $ctrl.additional = template.additional_material;
        $ctrl.form = submission;
        $ctrl.status = submission.status;

        if(submission.evaluation.scores){
          $ctrl.scores = submission.evaluation.scores;
        }
        if(submission.evaluation.comments){
          $ctrl.comments = submission.evaluation.comments;
        }
      },function(error){
        console.log(error);
      });
    }

  }

})();
