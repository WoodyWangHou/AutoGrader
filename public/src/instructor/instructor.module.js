(function(){
'use strict'

  angular.module('instructor',['ui.router','angularCSS'])
  .constant('INSTRUCTOR_STATE',{
    HOME:"instructor",
    HOME_STUDENT:"instrStudents",
    HOME_STUDENT_FORM:"instrStudents.form",
    HOME_ASSIGNMENT:"instrAssignments",
    HOME_ASSIGNMENT_FORM:"instrAssignments.form",
    HOME_ASSIGNMENT_CREATE:"instrAssignments.create"
  })
  .constant('INSTRUCTOR_ICON',{
      HOME:"home",
      HOME_STUDENT:"group",
      HOME_ASSIGNMENT:"pencil",
      HOME_STUDENT_FORM:"book",
      HOME_ASSIGNMENT_FORM:"book",
      HOME_ASSIGNMENT_CREATE:"edit"
    });

})();
