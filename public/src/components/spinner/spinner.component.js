(function() {
"use strict";

angular.module('autograder')
.component('spinner', {
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
				$ctrl.isSpinnerOn = true;
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$stateChangeSuccess',
			function(event,toState,toParams,fromState,fromParams){
				NProgress.done();
  				NProgress.remove();
				$ctrl.isSpinnerOn = false;
			});
		cancellers.push(cancel);

		var cancel = $rootScope.$on('$stateChangeError',
			function(event,toState,toParams,fromState,fromParams){
				NProgress.done();
  				NProgress.remove();
				$ctrl.isSpinnerOn = false;
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
