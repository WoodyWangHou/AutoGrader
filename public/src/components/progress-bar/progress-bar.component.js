(function() {
"use strict";

angular.module('autograder')
.component('progressBar', {
  templateUrl:'src/components/progress-bar/progress-bar.html',
  bindings:{
      progressTable:'<',
      info:'<',
      title:'<'
  }
});

})();
