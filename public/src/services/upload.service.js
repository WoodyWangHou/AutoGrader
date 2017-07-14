(function(){
"use strict";

angular.module('service')
.service('ajaxUploadService', AjaxUpload);
// FileUploader,
AjaxUpload.$inject = ['FileUploader','fileUploadUrl','$http','$cookies','REMOTE_SERVER','REQUEST_URL'];
function AjaxUpload(FileUploader,fileUploadUrl,$http,$cookies,REMOTE_SERVER,REQUEST_URL){

  var service = this;

  service.getAssignmentFileUploader = function(){
    var token = $cookies.get('token');

    var uploader = new FileUploader();
    uploader.headers = {
      "x-access-token":token
    };
    uploader.url = REMOTE_SERVER+fileUploadUrl;
    return uploader;
  }

  service.getStudentAssignmentUploader = function(id){
    var token = $cookies.get('token');

    var uploader = new FileUploader();
    uploader.headers = {
      "x-access-token":token,
      "id":id
    };
    uploader.url = REMOTE_SERVER + REQUEST_URL.STUDENT + REQUEST_URL.STUDENT_SUBMIT_SAVE;
    return uploader;
  }

  service.login = function(username,password){
  	var user = {
  		username:username,
  		password:password
  	};

  	 return $http.post(REMOTE_SERVER+'/users/login',user);
  	}

  service.logout = function(){
    return $http.get(REMOTE_SERVER + REQUEST_URL.LOGOUT);
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

  service.deleteTemplateById = function(templateId){
    var config = {
      params:{
        template_id:templateId
      }
    };
    var url = REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.DELETE_ALL_ASSIGNMENT;
    var deletion  = $http.delete(url,config);
    return deletion;
  }

  service.deleteAssignmentById = function(assignmentId){
    var config = {
      params:{
        assignment_id:assignmentId
      }
    };
    var url = REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.DELETE_ASSIGNMENT_BY_ID;
    var deletion  = $http.delete(url,config);
    return deletion;
  }

  service.saveOrSubmitAssignment = function(assignmentId,assignment_data){
    var data = assignment_data;
    data.assignment_id = assignmentId;

    var url = REMOTE_SERVER+REQUEST_URL.STUDENT+REQUEST_URL.STUDENT_SUBMIT_SAVE;// to change
    var assignment = $http.post(url,data);
    return assignment;
  }

  service.urlFormatter = function(){
    
    return function(url){
      if(!url){
        return "";
      }

      var re = /%20/g;
      var result = url.replace(re," ");
      
      var delimiter = /\\|\//g;
        if(delimiter.test(url)){
          result = result.replace(delimiter,"/");
        }
      result = REMOTE_SERVER + result;
      return result;
    };

  }

}

})();
