(function(){
"use strict";

angular.module('service')
.config(httpInterceptorRegistry)
.factory('accessTokenHttpInterceptor', accessTokenHttpInterceptor);

httpInterceptorRegistry.$inject = ['$httpProvider'];
function httpInterceptorRegistry($httpProvider){

  $httpProvider.interceptors.push('accessTokenHttpInterceptor');
}

accessTokenHttpInterceptor.$inject = ['$cookies','$rootScope','$q','$location'];
function accessTokenHttpInterceptor($cookies,$rootScope,$q,$location){

  var loadingContent = 0;
  return {
        //For each request the interceptor will set the bearer token header.
        request: function($config) {
            //Fetch token from cookie
            var token=$cookies.get('token');
            //set authorization header
            $config.headers["x-access-token"] =token;

            if(loadingContent ===0){
                $rootScope.$emit('$http:start');
            }else{
                $rootScope.$emit('$http:progress');
            }
            loadingContent++;
            return $config;
        },
        requestError: function(rejection){
            loadingContent = 0;
            $rootScope.$emit('$http:finish','finish');
            return $q.reject(rejection);
        },
        response: function(response) {
            //if you get a token back in your response you can use 
            //the response interceptor to update the token in the 
            //stored in the cookie
              if (response.data['token']) {
                    //fetch token
                    var token=response.data['token'];
                    //set token
                    $cookies.put('token', token);
              }
              if(loadingContent === 1){
                $rootScope.$emit('$http:finish','finish');
              }
              loadingContent--;
            return response;
        },
        responseError: function(rejection){
          loadingContent = 0;
          $rootScope.$emit('$http:finish','finish');
          var status = rejection.status;
          switch(status){
            case 401:
            case 403:
                $location.path('/');
            break;
          }
          return $q.reject(rejection);
        }
    };
}

})();
