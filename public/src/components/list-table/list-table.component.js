(function() {
"use strict";

angular.module('student')
.component('listTable', {
  templateUrl:'src/components/list-table/list-table.html',
  bindings:{
        detail:'<',
        column:'<',
        name:'<',
        instructor:'<',
        title:'<'
  }
});

})();
