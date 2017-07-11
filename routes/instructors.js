var express = require('express');
var router = express.Router();
var filesystem =require('fs');
var async = require('async');

var query = require('../utils/Query');
var verify = require('../utils/VerifyUser');
var paths = require('../utils/paths');

var user = require('../models/user');
var assign = require('../models/assignment');
var submission = require('../models/submission');
var template = require('../models/template');
var evaluation = require('../models/evaluation');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,paths.PRESCRIPTION);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});
var upload = multer({storage:storage});

/**
  create assignment
**/

var createAssignment = function(req,res,next){

  var db_addSubmission = function(assignments,callback){
      var temp = {
          formulation:[{
              ingredient_name:"",
              official_quantity:"",
              used_quantity:0,
              actual_quantity_weighted:0,
              signature:""
              }],
          calculation: "",
          method:"",
          packing:"",
          storage:"",
          main: "",
          Auxiliary: "",
          status:"new",
          submission_date:"",
          scores:0,
          assignment:assignments._id
      };

      submission.create(temp,function(err,submission){
        if(err){
          console.log("Submission Creation err: ",err);
          return callback(err,null);
        }else{
          console.log('Submission Created:',submission);
          assign.findOneAndUpdate({_id:assignments._id},{submission:submission._id},(err,assignment)=>{
            if(err){
              return callback(err,null);
            }
            console.log('Submission Added:',assignment);
            callback(null,'Done');
          });
        }
      });
  }

  var db_getStudentsIdByMatricNumber = function(matric_number,callback){
    user.findOne({username:matric_number},function(err,user){
      if(err){
        console.log("student "+matric_number+" not found: ",err);
        return callback(err,null);
      }else{
        // console.log('matric number to find:',matric_number);
        callback(null,user);
      }
    });
  }

  var db_addAssignmentstoStudents = function(id,assignment,callback){
    user.findById(id,(err,user)=>{
        user.assignments.push(assignment._id);
        user.save((err)=>{
          if(err){
            console.log('add assignment fail:',err);
            return callback(err,null);
          }else{
            console.log('add data:',user);
            callback(null,'Done');
          }
        });
    });
  }

  var db_createAssignment = function(templateId,studentsList){
    // console.log('List of Students are: ',studentsList);
    var findStudentsIdTasks = [];
    for(var student in studentsList){
      if(student.indexOf('number') !== -1){
        var matric = studentsList[student];
        (function(matric){
          findStudentsIdTasks.push(function(callback){
          db_getStudentsIdByMatricNumber(matric,callback);
        });
        })(matric);
      }
    }

    async.parallel(findStudentsIdTasks,function(err,studentIds){
        if(err){
          return next(err);
        }
        console.log("Student's Id is:",studentIds);
        // create assignment when all students' id are found
        async.each(studentIds,function(studentId,callback){
            assign.create({template:templateId,student:studentId},function(err,assignment){
                if(err){
                  console.log("assignemnt create failed: ",err.toJSON());
                  return callback(err.toJSON());
                }else{

                  var addAssignmentTask = function(callback){
                    db_addAssignmentstoStudents(studentId,assignment,callback);
                  };            
                  var addSubmissionTask = function(callback){
                    db_addSubmission(assignment,callback);
                  };

                  async.parallel([addAssignmentTask,addSubmissionTask],(err,results)=>{
                      if(err){
                        console.log('Add assignment or submission error:',err);
                        return callback(err.toJSON());
                      }
                      callback();
                  });

                }});// end of creating assignment via mongoose
        },(err)=>{
          if(err){
            return next(err);
          }else{
            res.status(200).json("Creation Successful");
            next();
          }
        });
    });
  }

  var db_createAssignmentTemplate = function(fileUrl,assignment_data){
    var break_deadline = assignment_data.deadline.split('/');
    var _deadline = new Date(break_deadline[2],break_deadline[1]-1,break_deadline[0]);
    console.log('deadline is:',_deadline);
      newTemplate = {
          assignment_name:assignment_data.assignment_name,
          description:assignment_data.assignment_description,
          additional_material:assignment_data.additional_material,
          prescription_url:fileUrl,
          deadline:_deadline
      };
      template.create(newTemplate,function(err,_template){
        if(err){
          console.log("template saving failed: ",err);
          return next(err);
        }else{
          console.log('template created: ',_template);
          db_createAssignment(_template._id,assignment_data);
        }
      });
  }

  var afterPrescriptionFolderExistCheck = function(err){
      if(err){
        filesystem.mkdir(paths.PRESCRIPTION,function(err){
          if(err){
            console.log("folder creation error:",err);
            return next(err);
          }else{
            db_createAssignmentTemplate(req.file.path,req.body);
          }
        });
      }else{
        db_createAssignmentTemplate(req.file.path,req.body);
      }
  }

  var afterFilesFolderExistCheck = function(err){
        if(err){
            filesystem.mkdir(paths.FILES,(err)=>{
              if(err){
                console.log("folder creation error:",err);
                return next(err);
              }else{
                filesystem.access(paths.PRESCRIPTION,filesystem.constants.F_OK,afterPrescriptionFolderExistCheck);
              }
            });
          }
          else{
            filesystem.access(paths.PRESCRIPTION,filesystem.constants.F_OK,afterPrescriptionFolderExistCheck);  
          }
        }

  //end of helper functions
      filesystem.access(paths.FILES,filesystem.constants.F_OK,afterFilesFolderExistCheck);
  }

router.route('/createassignment').post(verify.verifyInstructorUser,upload.single('file'),createAssignment);

// router to get assignment list

var getAssignmentList = function(req,res,next){
  var query = template.find({});

  var db_getAssignmentList = function(err,list){
    if(err){
      console.log('cannot get the list:',err);
      return next(err);
    }
    res.json(list);
    next();
  }
  query.exec(db_getAssignmentList);
}

router.route('/getassignmentlist').get(verify.verifyInstructorUser,getAssignmentList);

// get assignment by id
var getAssignmentById = function(req,res,next){
  var assignmentId = req.query.assignment_id;
  var qry = {_id:assignmentId};

  assign.findOne(qry)
        .populate('template')
        .populate({
          path:'student',
          model:'user'
        })
        .populate({
          path:'submission',
          populate:{path:'evaluation'}
        })
        .exec((err,result)=>{
          if(err){
            console.log('cannot get assignment:',err);
            err.data = 'cannot get assignment';
            return next(err);
          }
          res.status(200).json(result);
        });
}

router.route('/getassignmentbyid').get(verify.verifyInstructorUser,getAssignmentById);

// router for get students under specified assignment

var getStudentsUnderAssignment = function(req,res,next){
  var assignmentId = req.query.assignment_id;
  var request = {template:assignmentId};
  var query = assign.find(request);

  var db_getSubmissionByAssignment = function(assignId,student,callback){
    submission.findOne({assignment:assignId},(err,submissions)=>{
      if(err){
        console.log('get submission failed:',err);
        callback(err,null);
      }else{
        var result = {};
        result.submission = submissions;
        result.student = student;
        callback(null,result);
      }
    });
  }

  var db_getStudentsAndSubmissions = function(assignment,callback){
    var studentId = assignment.student;
    var assignmentId = assignment._id;

    user.findById(studentId,(err,student)=>{
      if(err){
        console.log('cannot find student: '+studentId+" : ",err);
        callback(err,null);
      }else{
        db_getSubmissionByAssignment(assignmentId,student,callback);
      }
    });

  }

  var db_getAssignmentsById = function(err,assignments){
    if(err){
      console.log('Get students failed:',err);
      return next(err);
    }
    // console.log('Found Assignments:\n',assignments);
    var getStudentsTasks = [];
    for(var i = 0;i<assignments.length;i++){
        var assignment = assignments[i];
        (function(assignment){
          getStudentsTasks.push(function(callback){
          db_getStudentsAndSubmissions(assignment,callback);
        });
        })(assignment);
    }

    async.parallel(getStudentsTasks,(err,results)=>{
      if(err){
        console.log('error occurs:',err);
        return next(err);
      }
      res.status(200).json(results);
      next();
    });

  }

  query.exec(db_getAssignmentsById);
}

router.route('/studentsinassignments').get(verify.verifyInstructorUser,getStudentsUnderAssignment);

// Get submission
var db_updateSubmission = function(data,eval,callback){
  let qry = {assignment:data.assignment_id};
  let update = {
    evaluation:eval._id,
    status:"evaluated"
  };

  submission.findOneAndUpdate(qry,update,{new:true},(err,result)=>{
    if(err){
      console.log('submission save error',err);
      return callback(err,null);
    }
    console.log('submission updated: ',result);
    callback(null,result);
  });

}

var db_createEvaluation = function(data,user,isEvaluated,subm,callback){
    let newEvaluation = {
      scores:{
        formulation:data.scores.formulation,
        calculation:data.scores.calculation,
        method:data.scores.method,
        packing:data.scores.packing,
        storageLabel:data.scores.storageLabel,
        mainLabel:data.scores.mainLabel,
        auxLabel:data.scores.auxLabel
      },
      comments:{
        formulation:data.comments.formulation,
        calculation:data.comments.calculation,
        method:data.comments.method,
        packing:data.comments.packing,
        storageLabel:data.comments.storageLabel,
        mainLabel:data.comments.mainLabel,
        auxLabel:data.comments.auxLabel
      },
      evaluatedBy:user._id
    };

  if(!isEvaluated){
      if(subm.status !== 'submitted'){
        let error = new Error('Student has not yet submit his/her assignment');
        error.data = 'Student has not yet submit his/her assignment';
        callback(error,null);
      }else{
        evaluation.create(newEvaluation,(err,eval)=>{
          if(err){
            console.log('Evaluation created failed: ',err);
            return callback(err,null);
          }
          console.log('new evaluation created:',eval);
          callback(null,data,eval);
        });
    }
  }else{
    evaluation.findOneAndUpdate({_id:subm.evaluation},newEvaluation,{new:true},(err,eval)=>{
      if(err){
        console.log('evaluation udpate fail:',err);
        return callback(err,null);
      }
      console.log('Evaluation already existed, updated:',eval);
      callback(null,data,eval);
    });
  }
}

var findSubmission = function(data,user,callback){
  let qry = {assignment:data.assignment_id};
 
  submission.findOne(qry,(err,result)=>{
    if(err){
      console.log('find submission error',err);
      return callback(err,null);
    }
    switch(result.status){
      case 'evaluated':
        callback(null,data,user,true,result);
      break;
      case 'submitted':
      case 'new':
      case 'updated':
        callback(null,data,user,false,result);
      break;
    }

  });

}

var createEvaluation = function(req,res,next){
  let firstFunction =  async.apply(findSubmission,req.body,req.decoded._doc);
  async.waterfall([firstFunction,db_createEvaluation,db_updateSubmission],
    (err,result)=>{
    if(err){
      console.log('error occurs:',err);
      return next(err);
    }
    console.log('creation result: ',result);

    res.status(200).json('evaluation save successfully');
    next();
  });
}

router.route('/submitevaluation').post(verify.verifyInstructorUser,createEvaluation);

var db_getEvaluation = function(data,user,isEvaluated,subm,callback){
  if(isEvaluated){
    submission.populate(subm,{path:'evaluation',model:'evaluation'},(err,result)=>{
      if(err){
        err.data = "can not find evaluation";
        console.log('can not find evaluation:',err);
        return callback(err,null);
      }
      console.log('after population:',result);
      callback(null,result);
    });
  }else{
      callback(null,subm);
  }
}

var getSubmissionCallback = function(req,res,next){
    let firstFunction = async.apply(findSubmission,req.query,req.decoded._doc);
    async.waterfall([firstFunction,db_getEvaluation],(err,result)=>{
      if(err){
        return next(err);
      }
      console.log('found submission:',result);
      res.status(200).json(result);
      next();
    });
}
router.route('/getSubmission').get(verify.verifyInstructorUser,getSubmissionCallback);

module.exports = router;
