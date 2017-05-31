(function() {
"use strict";

angular.module('autograder')
.component('assignmentForm', {
  templateUrl:'src/components/assignment-form/assignment-form.html',
  bindings:{
        additional:'<',
        detail:'<',
        form:'<',
        addRow:'&',
        deleteRow:'&',
        uploader:'<',
        instructor:'<',
        uploadeOptionStorage:'<',
        uploadeOptionMainLabel:'<',
        uploadeOptionAuxLabel:'<'
  }
});

})();
