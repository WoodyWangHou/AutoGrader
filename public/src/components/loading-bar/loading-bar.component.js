(function() {
"use strict";

angular.module('autograder')
.component('loadingBar', {
  // templateUrl:'src/components/spinner/spinner.html',
  controller: spinnerController
  });

spinnerController.$inject = ['$rootScope'];
function spinnerController ($rootScope){
	var $ctrl = this;
	var cancellers = [];

	$ctrl.$onInit = function(){
		var cancel = $rootScope.$on('$stateChangeStart',
			function(event,toState,toParams,fromState,fromParams){
				NProgress.start();
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$stateChangeSuccess',
			function(event,toState,toParams,fromState,fromParams){
				NProgress.done();
  				NProgress.remove();
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$stateChangeError',
			function(event,toState,toParams,fromState,fromParams){
				NProgress.done();
  				NProgress.remove();
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$http:progress',
			function(event,data){
				NProgress.inc();
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$http:finish',
			function(event,data){
				NProgress.done();
				NProgress.remove();
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$http:start',
			function(event,data){
				NProgress.start();
			});
		cancellers.push(cancel);
	};

	$ctrl.$onDestroy = function(){
		cancellers.forEach(function(item){
			item();
		});
	};
}


})();
