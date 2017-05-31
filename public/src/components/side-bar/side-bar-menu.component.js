(function() {
"use strict";

angular.module('autograder')
.component('sideBarMenu', {
  templateUrl:'src/components/side-bar/side-bar-menu.html',
  bindings:{
      menus:'<'
  }
});

})();
