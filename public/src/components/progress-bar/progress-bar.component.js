(function() {
"use strict";

angular.module('student')
.component('progressBar', {
  templateUrl:'src/components/progress-bar/progress-bar.html',
  bindings:{
      progressTable:'<',
      title:'<'
  }
});

})();
