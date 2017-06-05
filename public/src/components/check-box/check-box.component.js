(function() {
"use strict";

angular.module('autograder')
.component('checkBox', {
  templateUrl:'src/components/check-box/check-box.html',
  bindings:{
  	 headTitle:'<',
  	 columnTitle:'<',
     rowContent:'<'
  }
});

})();
