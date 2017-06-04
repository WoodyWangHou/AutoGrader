(function(){
'use strict'

  angular.module('instructor')
  .controller('assignmentCreateController',assignmentCreateController);

  const MAIN_LABEL = 1;
  const AUX_LABEL = 2;
  const STORAGE = 3;

  assignmentCreateController.$inject =['$state','$stateParams','userInterfaceInitService','ajaxUploadService'];
  function assignmentCreateController($state,$stateParams,userInterfaceInitService,ajaxUploadService){

    var $ctrl = this;
    var init = new UIinit();

    $ctrl.instructor = true;
    $ctrl.assignmentId = $stateParams.assignmentId;
    $ctrl.detail = userInterfaceInitService.getAssignmentById($ctrl.assignmentId);
    $ctrl.additional = userInterfaceInitService.getAssignmentAdditionalMaterialById($ctrl.assignmentId);
    // config file uploader
    $ctrl.uploader = ajaxUploadService.getAssignmentFileUploader();
    console.log($ctrl.uploader);
    $ctrl.uploader.queueLimit = 2;
    $ctrl.uploadeOptionStorage = init.getUploaderOption(STORAGE);
    $ctrl.uploadeOptionMainLabel = init.getUploaderOption(MAIN_LABEL);
    $ctrl.uploadeOptionAuxLabel = init.getUploaderOption(AUX_LABEL);
    // viewmodel for 1.formulation
    var form = init.setForm();
    var formElement=init.getNewRow();
    form.formulation.push(formElement);

    $ctrl.form = form;
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

    init.getUploaderOption =function(option){
        switch(option){
          case MAIN_LABEL:
          return {
            alias:"mainLabel"
          };
          break;
          case AUX_LABEL:
          return {
            alias:"auxLabel"
          };
          break;
          case STORAGE:
          return {
            alias:"storage"
          };
          break;
          default:
        }
    };
  }

})();
