(function(){
'use strict'

  angular.module('autograder',['login','student','instructor','service','loadingBar'])
  .constant('baseAPI','localhost:3000')
  .config(config);

  config.$inject = ['$urlRouterProvider','$locationProvider'];
  function config($urlRouterProvider,$locationProvider){
    // If user goes to a path that doesn't exist, redirect to public root
    $urlRouterProvider.otherwise('/login');

    // $locationProvider.html5Mode(turnOnHtml5());
    // // $locationProvider.hashPrefix('!');
  }

  var turnOnHtml5 = function(){
  	return true;
  }

})();
