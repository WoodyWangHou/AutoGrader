(function() {
"use strict";

angular.module('autograder')
.component('toDoList', {
  templateUrl:'src/components/to-do-list/to-do-list.html',
  bindings:{
  	  defaultText:'<',
      toDoList:'<',
      isInstructor:'<',
      title:'<'
  }
});

})();
