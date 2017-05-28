(function(){
"use strict";

angular.module('service')
.service('ajaxUploadService', AjaxUpload);

AjaxUpload.$inject = ['FileUploader','fileUploadUrl'];
function AjaxUpload(FileUploader,fileUploadUrl){

  var service = this;

  service.getAssignmentFileUploader = function(){
    var uploader = new FileUploader();
    uploader.url = fileUploadUrl;
    uploader.headers ={};
    return uploader;
  };

}

})();
