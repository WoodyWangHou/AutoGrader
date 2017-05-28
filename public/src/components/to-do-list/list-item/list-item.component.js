(function() {
"use strict";

angular.module('student')
.component('listItem', {
  templateUrl:'src/components/to-do-list/list-item/list-item.html',
  bindings:{
      listItem:'<'
  }
});

})();
