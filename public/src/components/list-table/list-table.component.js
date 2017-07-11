(function() {
"use strict";

angular.module('autograder')
.component('listTable', {
  templateUrl:'src/components/list-table/list-table.html',
  bindings:{
        detail:'<',
        column:'<',
        name:'<',
        title:'<'
  }
});

})();
