(function () {
"use strict";

angular.module('service')
.service('userInterfaceInitService', userInterfaceInitService);

userInterfaceInitService.$inject= ['STUDENT_STATE','STUDENT_ICON'];
function userInterfaceInitService(STUDENT_STATE,STUDENT_ICON) {
  // This is student interface ajax service
  var service = this;
  service.studentInfo = {};
  service.actionBox = [];
  service.assignment = [];

  service.studentMenu = [
    {
      name:'Home',
      class:"",
      goToState:STUDENT_STATE.HOME,
      icon:"icon icon-"+STUDENT_ICON.HOME,
    },
    {
      name:'Assignments',
      class:"",
      goToState:STUDENT_STATE.HOME_ASSIGNMENT,
      icon:"icon icon-"+STUDENT_ICON.HOME_ASSIGNMENT,
    }
  ];

  service.getName = function(){
    // var studentInfo = {};
    // studentInfo.username = "Woody Wang";
    // studentInfo.description = "Assignments";
    return "Woody Wang";
  }

  service.getTitle = function(){
    return "Assignments";
  }

  service.getStudentMenu = function (state) {
    for(var i =0;i<service.studentMenu.length;i++){
      if(service.studentMenu[i].class)
        service.studentMenu[i].class="";
    }
      switch(state){
        case STUDENT_STATE.HOME:
        service.studentMenu[0].class += " active";
        break;
        case STUDENT_STATE.HOME_ASSIGNMENT:
        case STUDENT_STATE.HOME_ASSIGNMENT_FORM:
        service.studentMenu[1].class += " active";
        break;
      }
    return service.studentMenu;
  };

  service.getStudentNav = function(state){
    var states = state.split('.');
    var navs = [];
    var temp = {};
    for(var i = 0;i<states.length;i++){
      switch(states[i]){
        case 'form':
        temp = {
           state:STUDENT_STATE.HOME_ASSIGNMENT,
           title:'Assignment Form',
           icon:STUDENT_STATE.HOME_ASSIGNMENT
         };
         break;
         case 'assignment':
         temp = {
            state:STUDENT_STATE.HOME_ASSIGNMENT,
            title:'Assignments',
            icon:STUDENT_STATE.HOME_ASSIGNMENT
          };
          break;
        default:
        temp = {
           state:STUDENT_STATE.HOME,
           title:'Home',
           icon:STUDENT_STATE.HOME
         };
        break;
      }
      navs.push(temp);
    }
    service.studentNav = navs;
    return service.studentNav;
  };

  service.getActionBox = function(){
    // need to insert async service to fetch assignments
    service.actionBox = [{
      style: "bg_lg span3",
      goToState:STUDENT_STATE.HOME_ASSIGNMENT,
      icon:STUDENT_ICON.HOME_ASSIGNMENT,
      title:"Assignment"
    }
  ];
    return service.actionBox;
  }

  service.getAssignmentSubmissionProgress = function(){
    return {
        title:"Progress",
        row1:"New Assignments",
        item1:(newAssign/total)*100,
        row2:"In Progress",
        item2:(progress/total)*100,
        row3:"Submitted",
        item3:(submitted/total)*100,
        row4:"Evaluated",
        item4:(evaluated/total)*100,
        row1Length:newAssign,
        row2Length:progress,
        row3Length:submitted,
        row4Length:evaluated
      };
  }

  service.getStudentAssignmentById = function(studentId){
    // to implement $http service
    switch(studentId){
      case "A0078679B":
        service.assignment = [{
          // assignment
          assignmentName:"Lecture 1 - Assignment 1",
          assignmentGroupId:"1",
          deadline:"10/03/2017",
          description:"Woody Wang's assignment 1",
          prescriptionUrl:"img/Prescription.jpg",
          // submission
          submissionDate:"30/04/2017",
          inProgress:false,
          scores:-1,
          assignmentId:"1",
          status:"submitted"
          // below is the mock data, need to ajax from server
          },{
          assignmentName:"Lecture 2 - Assignment 2",
          assignmentGroupId:"2",
          deadline:"13/02/2017",
          description:"Woody Wang's assignment 2",
          prescriptionUrl:"img/Prescription.jpg",
          submissionDate:"30/04/2017",
          inProgress:false,
          scores:-1,
          assignmentId:"2",
          status:"submitted"
          // below is the mock data, need to ajax from server

        }];
      break;
      case "A0078679A":
      service.assignment = [{
          assignmentName:"Lecture 1 - Assignment 1",
          assignmentGroupId:"1",
          deadline:"10/03/2017",
          submissionDate:"",
          description:"Wang Hou's assignment 1",
          inProgress:false,
          scores:-1,
          assignmentId:"3",
          status:"submitted",
          // below is the mock data, need to ajax from server
          prescriptionUrl:"img/Prescription.jpg"
          },{
          assignmentName:"Lecture 2 - Assignment 2",
          assignmentGroupId:"2",
          deadline:"13/02/2017",
          submissionDate:"30/04/2017",
          description:"Wang Hou's assignment 2",
          inProgress:false,
          scores:-1,
          assignmentId:"4",
          status:"submitted",
          // below is the mock data, need to ajax from server
          prescriptionUrl:"img/Prescription.jpg"
        }];
      break;
      default:
        service.assignment = [{
          assignmentName:"Lecture 1 - Assignment 1",
          assignmentGroupId:"1",
          deadline:"10/03/2017",
          submissionDate:"30/04/2017",
          description:"Default test assignent 1",
          inProgress:false,
          scores:-1,
          assignmentId:"1",
          status:"submitted",
          // below is the mock data, need to ajax from server
          prescriptionUrl:"img/Prescription.jpg"
          },{
          assignmentName:"Lecture 2 - Assignment 2",
          assignmentGroupId:"2",
          deadline:"13/02/2017",
          submissionDate:"30/04/2017",
          description:"Default test assignent 2",
          inProgress:false,
          scores:-1,
          assignmentId:"2",
          status:"submitted",
          // below is the mock data, need to ajax from server
          prescriptionUrl:"img/Prescription.jpg"
      },
      {
          assignmentName:"Lecture 1 - Assignment 1",
          assignmentGroupId:"1",
          deadline:"10/03/2017",
          submissionDate:"",
          description:"Wang Hou's assignment 1",
          inProgress:false,
          scores:-1,
          assignmentId:"3",
          status:"submitted",
          // below is the mock data, need to ajax from server
          prescriptionUrl:"img/Prescription.jpg"
          },{
          assignmentName:"Lecture 2 - Assignment 2",
          assignmentGroupId:"2",
          deadline:"13/02/2017",
          submissionDate:"30/04/2017",
          description:"Wang Hou's assignment 2",
          inProgress:false,
          scores:-1,
          assignmentId:"4",
          status:"submitted",
          // below is the mock data, need to ajax from server
          prescriptionUrl:"img/Prescription.jpg"
        }];
  }
    service.assignment.title = "Assignment List";
    return service.assignment;
  }

  service.getAssignmentById = function(assignmentId){
    service.getStudentAssignmentById();
        for(var i = 0;i<service.assignment.length;i++){

            if(service.assignment[i].assignmentId == assignmentId){
              return service.assignment[i];
            
          }
        }
    }

// for assignment.form additional materials, ajax to pull data
  service.getAssignmentAdditionalMaterialById = function(assignmentId){
    return "Test: Additional Materials";
  }
}
})();
