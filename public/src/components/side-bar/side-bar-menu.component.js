(function() {
"use strict";

angular.module('student')
.component('sideBarMenu', {
  templateUrl:'src/components/side-bar/side-bar-menu.html',
  bindings:{
      menus:'<'
  }
});

})();
