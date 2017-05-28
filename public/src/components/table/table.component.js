(function() {
"use strict";

angular.module('student')
.component('table', {
  templateUrl:'src/components/table/table.html',
  bindings:{
      title:'<',
      column:'<'
  }
});

})();
