(function () {
"use strict";

angular.module('service')
.service('instructorInterfaceInitService', instructorInterfaceInitService);

instructorInterfaceInitService.$inject= [
'STUDENT_STATE',
'STUDENT_ICON',
'INSTRUCTOR_STATE',
'INSTRUCTOR_ICON',
'userInterfaceInitService'];
function instructorInterfaceInitService(
  STUDENT_STATE,
  STUDENT_ICON,
  INSTRUCTOR_STATE,
  INSTRUCTOR_ICON,
  userInterfaceInitService) {
  // This is student interface ajax service
  var service = this;
  service.username = {};
  service.actionBox = [];
  service.assignment = [];

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
  };

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
    // need to insert async service to fetch assignments
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

  service.getRecentStudentSubmission = function(){
    return userInterfaceInitService.getStudentAssignmentById();
  }

  service.getSubmissionProgress = function(){
      var assignments = [];
      // pull all assignments from server
      assignments.push(userInterfaceInitService.getStudentAssignmentById('A0078679A'));
      assignments.push(userInterfaceInitService.getStudentAssignmentById('A0078679B'));

      return getSubmissionResultFromServer(assignments);
  }

  var getSubmissionResultFromServer = function(assignments){
    var nameOfAssignments = [];
    var progress = {};
    var result = {};

    result = getSubmissionResult(assignments);
    nameOfAssignments = service.getAllAssignmentNames();

      progress = {title:"Assignment Submission Progress"};
      progress.progressTable = [];
      
      for(var i =0;i<nameOfAssignments.length;i++){
        var temp = {
            rowTitle:nameOfAssignments[i].name,
            value:result[nameOfAssignments[i].name]+"/"+result[nameOfAssignments[i].name+"Total"],
            percent:((result[nameOfAssignments[i].name]*100)/(result[nameOfAssignments[i].name+"Total"]*100))*100
          };
        progress.progressTable.push(temp);
        }

     return progress;
  }

  var getSubmissionResult = function(assignments){
        var result = {};

        for(var i = 0; i<assignments.length;i++){
        for(var j = 0; j<assignments[i].length;j++){
        if(assignments[i][j].submissionDate){

            if(!result[assignments[i][j].assignmentName]){
              result[assignments[i][j].assignmentName] = 1;
            }
            else{
              result[assignments[i][j].assignmentName]++;
            }
          }

            if(!result[assignments[i][j].assignmentName+"Total"]){
              result[assignments[i][j].assignmentName+"Total"] = 1;
            }else{
              result[assignments[i][j].assignmentName+"Total"]++;   
            }
          }
        }
        return result;
  }

  service.getAllAssignmentNames = function(){
    var nameOfAssignments = [];
    var assignments = [];
    // pull all assignments from server
    assignments.push(userInterfaceInitService.getStudentAssignmentById('A0078679A'));
    assignments.push(userInterfaceInitService.getStudentAssignmentById('A0078679B'));

    for(var i = 0; i<assignments.length;i++){
        for(var j = 0; j<assignments[i].length;j++){
            if(!isExist(assignments[i][j],nameOfAssignments)){
              var name = {
                name:assignments[i][j].assignmentName,
                assignmentGroupId:assignments[i][j].assignmentGroupId
              };
              nameOfAssignments.push(name);
            }
        }
      }
    return nameOfAssignments;
  }

  var isExist = function(assignment,nameOfAssignments){
        for(var i = 0;i<nameOfAssignments.length;i++){
          if(nameOfAssignments[i].name === assignment.assignmentName){
            return true;
          }
        }
        return false;
  };

  service.getAssignmentById = function(assignmentId){
    service.assignment = userInterfaceInitService.getStudentAssignmentById();
        for(var i = 0;i<service.assignment.length;i++){
          for(var key in service.assignment[i]){
            if(service.assignment[i][key].indexOf(assignmentId)){
              return service.assignment[i];
            }
          }
        }
    }

// for assignment.form additional materials, ajax to pull data
  service.getAssignmentAdditionalMaterialById = function(assignmentId){
    return "Test: Additional Materials";
  }

  service.getStudents = function(){
    return [
      {
        matricNumber:"A0078679A",
        name:"Wang Hou"
      },
      {
        matricNumber:"A0078679B",
        name:"Woody Wang"
      }
    ];
  }

// download list of students, categorized by assignments
  service.getStudentsByAssignmentId = function(assignmentGroupId){
    var students = [];

    var students = [{
           // assignment
          assignmentName:"Lecture 1 - Assignment 1",
          assignmentGroupId:"1",
          deadline:"10/03/2017",
          description:"Woody Wang's assignment 1",
          prescriptionUrl:"img/Prescription.jpg",
          //user
          students:[
            {
              matricNubmer:"A0078697A",
              name:"Wang Hou",
              submissionDate:"30/02/2017",
              inProgress:false,
              scores:-1,
              assignmentId:"3",
              status:"submitted"
            },{
              matricNubmer:"A0078679B",
              name:"Woody Wang",
              submissionDate:"30/04/2017",
              assignmentId:"1",
              scores:-1,
              inProgress:false,
              status:"submitted"
            }
          ]
        },
        {
           // assignment
          assignmentName:"Lecture 2 - Assignment 2",
          assignmentGroupId:"2",
          deadline:"13/02/2017",
          description:"Woody Wang's assignment 2",
          prescriptionUrl:"img/Prescription.jpg",
          //user
          students:[
            {
              matricNubmer:"A0078697A",
              name:"Wang Hou",
              submissionDate:"30/02/2017",
              assignmentId:"4",
              inProgress:false,
              scores:-1,
              status:"submitted"
            },{
              matricNubmer:"A0078679B",
              name:"Woody Wang",
              submissionDate:"30/04/2017",
              assignmentId:"2",
              inProgress:false,
              scores:-1,
              status:"submitted"
            }
          ]
    }];

    for(var i=0;i<students.length;i++){
        if(assignmentGroupId == students[i].assignmentGroupId){
          return students[i].students;
        }
    }
  } 

    service.getNewAssignmentId = function(){
      //ajax to backend and get a new id
      const ID_LENGTH = 22;

      return random_base64(ID_LENGTH);
    }

    var random_base64 = function(length){
      var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      var str="";

      for(var i =0;i<length;i++){
        var rand = Math.floor((Math.random()*Date.now())%1*ALPHABET.length);
        str += ALPHABET.slice(rand,rand+1);
      }

      return str;
    }
}
})();
