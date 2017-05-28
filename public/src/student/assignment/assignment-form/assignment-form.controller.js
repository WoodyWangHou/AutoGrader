(function(){
'use strict'

  angular.module('student')
  .controller('assignmentFormController',assignmentFormController);

  assignmentFormController.$inject =['$state','$stateParams','userInterfaceInitService','ajaxUploadService'];
  function assignmentFormController($state,$stateParams,userInterfaceInitService,ajaxUploadService){
    var $ctrl = this;
    $ctrl.assignmentId = $stateParams.assignmentId;
    $ctrl.detail = userInterfaceInitService.getAssignmentById($ctrl.assignmentId);
    $ctrl.additional = userInterfaceInitService.getAssignmentAdditionalMaterialById($ctrl.assignmentId);
    // config file uploader
    $ctrl.uploader = ajaxUploadService.getAssignmentFileUploader();
    $ctrl.uploader.queueLimit = 2;
    $ctrl.uploadeOptionStorage = {
      alias:"storage"
    };
    $ctrl.uploadeOptionMainLabel = {
      alias:"mainLabel"
    };
    $ctrl.uploadeOptionAuxLabel = {
        alias:"auxLabel"
      };
    // viewmodel for 1.formulation
    var form = {
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
    var formElement={
      ingredient:"",
      quantity:0,
      used:0,
      actual:0
    };
    form.formulation.push(formElement);
    $ctrl.form = form;
    // add row function to formulation
    $ctrl.addRow = function (){
      var newRow = {
        ingredient:"",
        quantity:0,
        used:0,
        actual:0
      };
      // console.log(newRow);
      // console.log($ctrl.form.formulation);
      $ctrl.form.formulation.push(newRow);
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

})();
