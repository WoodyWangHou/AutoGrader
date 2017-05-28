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
        css:['css/matrix-login.css',
            'font-awesome/css/font-awesome.css',
            'http://fonts.googleapis.com/css?family=Open+Sans:400,700,800']
      });
      // .state('login.recover', {
      //   url: '/',
      //   templateUrl: 'src/login/login-recover/login-recover.html'
      //   controller: 'LoginRecoverController',
      //   controllerAs: 'LoginRecoverCtrl',
      // );
}

})();
