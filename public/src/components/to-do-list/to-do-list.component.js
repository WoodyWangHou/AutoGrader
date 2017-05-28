(function() {
"use strict";

angular.module('student')
.component('toDoList', {
  templateUrl:'src/components/to-do-list/to-do-list.html',
  bindings:{
      toDoList:'<',
      title:'<'
  }
});

})();
