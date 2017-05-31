(function() {
"use strict";

angular.module('autograder')
.component('table', {
  templateUrl:'src/components/table/table.html',
  bindings:{
      title:'<',
      column:'<'
  }
});

})();
