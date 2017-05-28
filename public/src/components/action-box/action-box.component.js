(function() {
"use strict";

angular.module('student')
.component('actionBox', {
  templateUrl:'src/components/action-box/action-box.html',
  bindings:{
      actionBox:'<'
  }
});

})();
