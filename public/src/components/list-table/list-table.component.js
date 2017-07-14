(function() {
"use strict";

angular.module('autograder')
.component('listTable', {
  templateUrl:'src/components/list-table/list-table.html',
  bindings:{
        detail:'<',
        column:'<',
        name:'<',
        toState:'<',//assignment;instructor;student
        title:'<'
  },
  controller:'listTableController'
})
.controller('listTableController',listTableController);

listTableController.$inject = ['$state','$stateParams','ajaxUploadService'];
function listTableController($state,$stateParams,uploadService){
	var $ctrl = this;

	$ctrl.$onChanges = function(obj){
		if(obj.toState){
			switch(obj.toState.currentValue){
				case 'assignment':
				$ctrl.toassignmentstate = true;
				break;
				case 'student':
				$ctrl.tostudentstate = true;
				break;
				case 'instructor':
				$ctrl.toinstructorformstate = true;
				break
			}
		}
	}

	$ctrl.deleteAssignment = function(assignmentId){
        var deletetask = uploadService.deleteAssignmentById(assignmentId);
        deletetask.then(function(res){
          $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
          });
        },function(err){
          console.log(err.data);
        });
	}

}

})();
