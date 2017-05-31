(function(){
'use strict'

  angular.module('login')
  .controller('LoginFormController',LoginFormController);

  LoginFormController.$inject = ['$state','$timeout'];
  function LoginFormController($state,$timeout){
    // If user goes to a path that doesn't exist, redirect to public root
    var $ctrl = this;
    $ctrl.username="";
    $ctrl.password=""

    $ctrl.submit = function() {
      // console.log("username is: ", $ctrl.username);
      // console.log("password is: ", $ctrl.password);
      let tempName = $ctrl.username.toLowerCase();
              if(tempName.indexOf('instructor')!= -1){
                $state.go('instructor');
              }else{
                $state.go('student');
              }
    };

    $ctrl.valid = function() {
      return ($ctrl.username !== '' && $ctrl.password !== '');
    };
}

})();
