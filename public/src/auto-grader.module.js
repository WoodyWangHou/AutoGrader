(function(){
'use strict'

  angular.module('autograder',['login','student','instructor','service','loadingBar'])
  .constant('baseAPI','localhost:3000')
  .config(config);

  config.$inject = ['$urlRouterProvider'];
  function config($urlRouterProvider){
    // If user goes to a path that doesn't exist, redirect to public root
    $urlRouterProvider.otherwise('/login');
  }

})();
