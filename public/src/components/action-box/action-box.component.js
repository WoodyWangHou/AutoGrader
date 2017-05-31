(function() {
"use strict";

angular.module('autograder')
.component('actionBox', {
  templateUrl:'src/components/action-box/action-box.html',
  bindings:{
      actionBox:'<'
  }
});

})();
