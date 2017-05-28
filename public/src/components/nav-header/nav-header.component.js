(function() {
"use strict";

angular.module('student')
.component('navHeader', {
  templateUrl:'src/components/nav-header/nav-header.html',
  bindings:{
      nav:'<'
  }
});

})();
