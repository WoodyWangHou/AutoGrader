(function () {
"use strict";

angular.module('service')
.service('instructorInterfaceInitService', instructorInterfaceInitService);

instructorInterfaceInitService.$inject= [
'STUDENT_STATE',
'STUDENT_ICON',
'INSTRUCTOR_STATE',
'INSTRUCTOR_ICON',
'$http',
'REMOTE_SERVER',
'REQUEST_URL'];
function instructorInterfaceInitService(
  STUDENT_STATE,
  STUDENT_ICON,
  INSTRUCTOR_STATE,
  INSTRUCTOR_ICON,
  $http,
  REMOTE_SERVER,
  REQUEST_URL) {
  // This is student interface ajax service
  var service = this;
  service.username = {};
  service.actionBox = [];
  service.assignment = [];

  /************************************
    below are UI initiator
  *************************************/  
  service.menu = [
    {
      name:'Home',
      class:"",
      goToState:INSTRUCTOR_STATE.HOME,
      icon:"icon icon-"+INSTRUCTOR_ICON.HOME,
    },
    {
      name:'Students',
      class:"",
      goToState:INSTRUCTOR_STATE.HOME_STUDENT,
      icon:"icon icon-"+INSTRUCTOR_ICON.HOME_STUDENT,
    },
    {
      name:'Assignments',
      class:"",
      goToState:INSTRUCTOR_STATE.HOME_ASSIGNMENT,
      icon:"icon icon-"+INSTRUCTOR_ICON.HOME_ASSIGNMENT,
    }
  ];

  service.getName = function(){
    var instructor = {};
    instructor.username = "Woody Wang";
    instructor.description = "Assignments";
    return instructor;
  }
  service.getInstructorMenu = function (state) {
      clearActiveMenu();
      return setActiveMenu(state);
  }

  var clearActiveMenu = function(){
    for(var i =0;i<service.menu.length;i++){
      if(service.menu[i].class)
        service.menu[i].class="";
    }
  }

  var setActiveMenu = function(state){
    switch(state){
        case INSTRUCTOR_STATE.HOME:
        service.menu[0].class += " active";
        break;
        case INSTRUCTOR_STATE.HOME_ASSIGNMENT:
        case INSTRUCTOR_STATE.HOME_ASSIGNMENT_FORM:
        case INSTRUCTOR_STATE.HOME_ASSIGNMENT_CREATE:
        service.menu[2].class += " active";
        break;
        case INSTRUCTOR_STATE.HOME_STUDENT:
        case INSTRUCTOR_STATE.HOME_STUDENT_FORM:
        service.menu[1].class += " active";
        break;
      }
      return service.menu;
  }

  service.getInstructorNav = function(toState){
    var toStates = toState.split('.');
    var containsHome = false;

      return setMenu(toStates);
    }

  var setMenu = function(toStates){
    var navs = [];
    var temp = {};

    if(!isContainHomeState(toStates)){
      navs.push(addMenuActive(INSTRUCTOR_STATE.HOME));
    }


    for(var i = 0;i<toStates.length;i++){
      if(toStates[i] == 'form'){
          if(toStates.indexOf(INSTRUCTOR_STATE.HOME_STUDENT)!=-1){
            navs.push(addMenuActive('stuForm'));
          }else{
            navs.push(addMenuActive(toStates[i]));
          }
      }else{
        navs.push(addMenuActive(toStates[i]));
      }
    }
    return navs;
  }

  var addMenuActive = function(state){
    var temp = {};

    switch(state){
          case 'create':
            temp = {
              toState:INSTRUCTOR_STATE.HOME_ASSIGNMENT_CREATE,
              title:'New Assignment',
              icon:INSTRUCTOR_ICON.HOME_ASSIGNMENT_CREATE
            };
          break;
        case 'stuForm':
          temp = {
               toState:INSTRUCTOR_STATE.HOME_STUDENT_FORM,
               title:'Assignment Form',
               icon:INSTRUCTOR_ICON.HOME_STUDENT_FORM
             };
        break;
        case 'form':
          temp = {
             toState:INSTRUCTOR_STATE.HOME_ASSIGNMENT_FORM,
             title:'Assignment Form',
             icon:INSTRUCTOR_ICON.HOME_ASSIGNMENT_FORM
           };
         break;
         case 'instrAssignments':
         temp = {
            toState:INSTRUCTOR_STATE.HOME_ASSIGNMENT,
            title:'Assignments',
            icon:INSTRUCTOR_ICON.HOME_ASSIGNMENT
          };
          break;
          case 'instrStudents':
         temp = {
            toState:INSTRUCTOR_STATE.HOME_STUDENT,
            title:'Students',
            icon:INSTRUCTOR_ICON.HOME_STUDENT
          };
          break;
        default:
        temp = {
           toState:INSTRUCTOR_STATE.HOME,
           title:'Home',
           icon:INSTRUCTOR_ICON.HOME
         };
      }
      return temp;
  }

   var isContainHomeState = function(states){
    for(var i =0;i<states.length;i++){
      if(states[i] == INSTRUCTOR_STATE.HOME){
        return true;
      }
    }
    return false;
  }

  service.getActionBox = function(){
    service.actionBox = [
    {
      style: "bg_ly",
      goToState:INSTRUCTOR_STATE.HOME_STUDENT,
      icon:INSTRUCTOR_ICON.HOME_STUDENT,
      title:"Students"
    },
    {
      style: "bg_lg span3",
      goToState:INSTRUCTOR_STATE.HOME_ASSIGNMENT,
      icon:INSTRUCTOR_ICON.HOME_ASSIGNMENT,
      title:"Assignment"
    }
  ];
    return service.actionBox;
  }

  /*************************************
      below are backend request helpers
  **************************************/ 

  service.getRecentStudentSubmission = function(){
    var url = REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.PENDINGEVALUATION;
    var submission = $http.get(url);
    return submission;
  }

  service.getAssignmentSubmission = function(assignmentId){
       var config = {
          params:{
            assignment_id:assignmentId
          }
        };
        var url = REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.SUBMISSION;
        var submission = $http.get(url,config);
        return submission;
  }

  service.getAllAssignmentNames = function(){
    var assignmentList = $http.get(REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.ASSIGNMENT_LIST);
    return assignmentList;
  }

  service.getAllStudentsByAssignments = function(template_id){
    var config = {
      params:{
        template_id:template_id
      }
    };
    var url = REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.STUDNETS_IN_ASSIGMENT;
    var students = $http.get(url,config);
    return students;
  }

  service.getAssignmentById = function(assignmentId){
      var config = {
        params:{
          assignment_id:assignmentId
        }
      };
      var url = REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.ASSIGNMENT_BY_ID;
      var assignment = $http.get(url,config);
      return assignment;
    }
  service.getStudents = function(){
    var studentList = $http.get(REMOTE_SERVER+REQUEST_URL.STUDENT+REQUEST_URL.STUDENT_LIST);

    return studentList;
  }

  service.evaluationSubmitUrl = function(){
    return (REMOTE_SERVER+REQUEST_URL.INSTRUCTOR+REQUEST_URL.EVALUATION);
  }

  /*********
    util helpers
  ********/ 
  service.numberToMonth = function(number){
  if(number>=0 && number<12){
    let months = ["January","February","March","April","May","June","July",
          "August","September","October","November","December"];

      return months[number];
    }else{
      return number;
    }
  }

  service.removeAssignment = function(assignmentId){

  }

  service.removeAllAssignment = function(templateId){

  }


}
})();
