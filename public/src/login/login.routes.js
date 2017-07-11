(function(){
'use strict'

  angular.module('login')
  .config(config);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    // If user goes to a path that doesn't exist, redirect to public root
    $stateProvider
      .state('login', {
        abstract: true,
        templateUrl: 'src/login/login.html'
      })
      .state('login.form', {
        url: '/login',
        templateUrl: 'src/login/login-main/login-form.html',
        controller: 'LoginFormController',
        controllerAs: 'LoginFormCtrl',
        css:['css/matrix-login.css']
      })
      .state('login.register', {
        url: '/register',
        templateUrl: 'src/login/login-register/login-register.html',
        controller: 'registerFormController',
        controllerAs: 'registerCtrl',
        css:['css/matrix-login.css']
      })
      ;
}

})();
