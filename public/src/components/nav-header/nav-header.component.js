(function() {
"use strict";

angular.module('autograder')
.component('navHeader', {
  templateUrl:'src/components/nav-header/nav-header.html',
  bindings:{
      nav:'<'
  }
});

})();
