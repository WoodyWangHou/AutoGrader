(function(){
"use strict";

angular.module('service')
.service('ajaxUploadService', AjaxUpload);
// FileUploader,
AjaxUpload.$inject = ['FileUploader','fileUploadUrl','$http','$cookies','REMOTE_SERVER'];
function AjaxUpload(FileUploader,fileUploadUrl,$http,$cookies,REMOTE_SERVER){

  var service = this;

  service.getAssignmentFileUploader = function(file,dataObj){
    var token = $cookies.get('token');

    var uploader = new FileUploader();
    uploader.headers = {
      "x-access-token":token
    };
    uploader.url = REMOTE_SERVER+fileUploadUrl;
    return uploader;
  }

  service.login = function(username,password){
  	var user = {
  		username:username,
  		password:password
  	};

  	 return $http.post(REMOTE_SERVER+'/users/login',user);
  	}

  service.register = function(username,password,first_name,last_name,enrollment_year,is_instructor){
    var user = {
      username:username,
      password:password,
      first_name:first_name,
      last_name:last_name,
      enrollment_year:enrollment_year,
      is_instructor:is_instructor
    };

    return $http.post(REMOTE_SERVER+'/users/register',user);
  }
}

})();
