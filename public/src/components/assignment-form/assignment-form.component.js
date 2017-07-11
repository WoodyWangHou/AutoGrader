(function() {
"use strict";

angular.module('autograder')
.component('assignmentForm', {
  templateUrl:'src/components/assignment-form/assignment-form.html',
  bindings:{
        addRow:'&',
        deleteRow:'&',
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
        viewOnlyMode:'<',
        evaluateMode:'<'
  },
  controller:'formController'
})
// .service('uploadService',uploadService)
.controller('formController',formController);

// uploadService.$inject = ['ajaxUploadService'];
// function uploadService(ajaxUploadService){
//   var service = this;
//   service.uploadToUrl = function(url){
//     let _url = parseString(url);
//   }
// }

formController.$inject=['$http','PDFViewerService'];
function formController($http, pdf){
  var $ctrl = this;
      $ctrl.prescription = pdf.Instance("prescription");


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

  $ctrl.$onChanges = function(){
      if($ctrl.evaluateMode && $ctrl.viewOnlyMode){
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

  var submitSuccess = function(res){
    if($ctrl.afterSubmitSuccess){
      $ctrl.afterSubmitSuccess(res);
    }
    $ctrl.success = res.status + " " + JSON.stringify(res.data);

  }

  var submitFailed = function(error){
      if($ctrl.afterSubmitFailed){
        $ctrl.afterSubmitSuccess(error);
      }
      $ctrl.error = error.status + " " + error.data;
      if(error.data){
        $ctrl.error += error.data;
      }
  }

  $ctrl.submit = function(){
    // instructor evaluation mode
    if($ctrl.evaluateMode && $ctrl.viewOnlyMode){
      if($ctrl.totalScores > 0 && $ctrl.totalScores < 100){
          
          if(isAllScoresAvailable()){
            var submission = {
                assignment_id:$ctrl.formId,
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
            $http.post($ctrl.submitUrl,submission).then(submitSuccess,submitFailed);
            return;
          }

      }
    }
  }


}

})();
