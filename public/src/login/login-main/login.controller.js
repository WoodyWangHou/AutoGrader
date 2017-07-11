(function(){
'use strict'

  angular.module('login')
  .controller('LoginFormController',LoginFormController);

  LoginFormController.$inject = ['$state','$timeout','ajaxUploadService','$cookies'];
  function LoginFormController($state,$timeout,ajaxUploadService,$cookies){
    // If user goes to a path that doesn't exist, redirect to public root
    var $ctrl = this;
    $ctrl.username="";
    $ctrl.password=""

    $ctrl.submit = function() {

      var data = ajaxUploadService.login($ctrl.username,$ctrl.password);
      
      data.then(function (res){
        console.log(res);
        if(res.data.is_instructor){
          $state.go('instructor');
        }else{
          $state.go('student');
        }
      },function(res){
        $ctrl.error = res.status;
        $ctrl.error += " "+res.statusText;
        if(res.data){
            $ctrl.error = res.data.error;
          }
      });

      // $state.go('instructor');
    };

    $ctrl.valid = function() {
      return ($ctrl.username !== '' && $ctrl.password !== '');
    };
}

})();
