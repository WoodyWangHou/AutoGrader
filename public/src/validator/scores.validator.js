(function(){
'use strict'

var INTEGER_REGEXP = /^-?\d+$/;

  angular.module('validator')
  .directive('score', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.score = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          var scores = parseInt(viewValue);
            if((scores >= 0) && (scores <= 100)){
              return true;
          }
        }

        // it is invalid
        return false;
      };
    }
  };
});

})();
