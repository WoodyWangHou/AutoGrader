(function(){
'use strict'

  angular.module('student',['ui.router','angularCSS'])
  .constant('STUDENT_STATE',{
    HOME:"student",
    HOME_ASSIGNMENT:"stuAssignments",
    HOME_ASSIGNMENT_FORM:"stuAssignments.form"
    // HOME_MATERIALS:"materials",
    // HOME_FEEDBACK: "feedback"
  })
  .constant('STUDENT_ICON',{
      HOME:"home",
      HOME_ASSIGNMENT:"pencil",
      HOME_MATERIALS:"book",
      HOME_FEEDBACK:"inbox"
    });

})();
