(function(){
'use strict'

  angular.module('login')
  .controller('registerFormController',registerFormController);

  registerFormController.$inject = ['$state','$timeout','ajaxUploadService','$cookies'];
  function registerFormController($state,$timeout,ajaxUploadService,$cookies){
    // If user goes to a path that doesn't exist, redirect to public root
    var $ctrl = this;
    var ui = new UIinit();
    $ctrl.username="";
    $ctrl.password="";
    $ctrl.first_name="";
    $ctrl.last_name="";
    $ctrl.enrollment_year=""
    $ctrl.is_instructor="";

    $ctrl.info = ui.getInfo();

    $ctrl.boolean_true = true;
    $ctrl.boolean_false = false;

    $ctrl.submit = function() {

      var data = ajaxUploadService.register($ctrl.username,
                                            $ctrl.password,
                                            $ctrl.first_name,
                                            $ctrl.last_name,
                                            $ctrl.enrollment_year,
                                            $ctrl.is_instructor);
      
      data.then(function (res){
        $ctrl.success = ui.getSuccess();
      },function(res){
        $ctrl.error = res.status;
        $ctrl.error += ": "+res.statusText+".";
        if(res.data){
            $ctrl.error +=" "+ res.data.error;
          }
      });
    };

    $ctrl.valid = function() {
      return ($ctrl.username !== '' && 
              $ctrl.password !== '' && 
              $ctrl.first_name !== '' &&
              $ctrl.last_name !== '' &&
              $ctrl.enrollment_year !== '' &&
              $ctrl.is_instructor !== '');
    };
}
  function UIinit(){
    var ui = this;

    ui.getInfo = function(){
      return "All of the fields are required to register!";
    };

    ui.getSuccess = function(){
      return "Registration Sucessful! Please go back to login page";
    };

  }

})();
