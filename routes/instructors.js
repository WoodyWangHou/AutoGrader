var express = require('express');
var router = express.Router();
var filesystem =require('fs');
var async = require('async');
var path = require('path');

var verify = require('../utils/VerifyUser');
var paths = require('../utils/paths');
var verifyDestination = require('../utils/checkFileUploadFolder');

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
          err.data = "Submission Creation err";
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
        err.data = "student "+matric_number+" not found";
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
            err.data = "add assignment fail";
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
                  err.data = "assignemnt create failed";
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
                        err.data="Add assignment or submission error";
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
    var destUrl = path.resolve(fileUrl);
    var serverPath = path.join(__dirname, '/../public');
    destUrl = destUrl.replace(serverPath,'');

    var break_deadline = assignment_data.deadline.split('/');
    var _deadline = new Date(break_deadline[2],break_deadline[1]-1,break_deadline[0]);
    // console.log('deadline is:',_deadline);
      newTemplate = {
          assignment_name:assignment_data.assignment_name,
          description:assignment_data.assignment_description,
          additional_material:assignment_data.additional_material,
          prescription_url:destUrl,
          deadline:_deadline
      };
      template.create(newTemplate,function(err,_template){
        if(err){
          console.log("template saving failed: ",err);
          err.data = "template saving failed";
          return next(err);
        }else{
          console.log('template created: ',_template);
          db_createAssignment(_template._id,assignment_data);
        }
      });
  }
  
  if(req.file){
    console.log(req.file);
    db_createAssignmentTemplate(req.file.path,req.body);
  }else{
   var err = new Error();
   err.data = 'no file uploaded';
   return next(err);
  }
}

router.route('/createassignment').post(verify.verifyInstructorUser,
                                       verifyDestination.checkUploadDir,
                                       upload.single('file'),createAssignment);

// router to get assignment list

var getAssignmentList = function(req,res,next){
 template.find({},(err,list)=>{
    if(err){
      console.log('cannot get the list:',err);
      err.data="cannot get the list";
      return next(err);
    }
    res.json(list);
    next();
  });
}

router.route('/getassignmentlist').get(verify.verifyInstructorUser,getAssignmentList);

// get assignment by id
var getAssignmentById = function(req,res,next){
  var assignmentId = req.query.assignment_id;
  var qry = {_id:assignmentId};

  assign.findOne(qry)
        .populate('template student submission')
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

  var db_getSubmissionByAssignment = function(assignId,student,callback){
    submission.findOne({assignment:assignId},(err,submissions)=>{
      if(err){
        console.log('get submission failed:',err);
        err.data = "get submission failed";
        return callback(err,null);
      }else{
        var result = {};
        result.submission = submissions;
        result.student = student;
        callback(null,result);
      }
    });
  }

  var _findUser = function(studentId,assignmentId,callback){
    user.findById(studentId,(err,student)=>{
      if(err){
        console.log('cannot find student: '+studentId+" : ",err);
        err.data = 'cannot find student'+studentId;
        return callback(err,null);
      }else{
        callback(null,assignmentId,student)
      }
    });
  }

  var db_getStudentsAndSubmissions = function(assignment,callback){
    var studentId = assignment.student;
    var assignmentId = assignment._id;

    var findUser = async.apply(_findUser,studentId,assignmentId);
    async.waterfall([findUser,db_getSubmissionByAssignment],(err,result)=>{
      if(err){
        return callback(err,null);
      }
      callback(null,result);
    });

  }

var getStudentsUnderAssignment = function(req,res,next){
  var templateId = req.query.template_id;
  var request = {template:templateId};
  assign.find(request,(err,assignments)=>{
    if(err){
      console.log('Get students failed:',err);
      err.data = 'Get students failed';
      return next(err);
    }

    var getStudentsTasks = [];
    for(var i = 0;i<assignments.length;i++){
          getStudentsTasks.push(async.apply(db_getStudentsAndSubmissions,assignments[i]));
    }

    async.parallel(getStudentsTasks,(err,results)=>{
      if(err){
        console.log('error occurs:',err);
        return next(err);
      }
      res.status(200).json(results);
      next();
    });

  });

}
router.route('/studentsinassignments').get(verify.verifyInstructorUser,getStudentsUnderAssignment);

var isAllScoresAvailable = function(score){
  return (score.formulation || "") &&
         (score.calculation || "") &&
         (score.method || "") &&
         (score.packing || "") &&
         (score.storageLabel || "") &&
         (score.mainLabel || "") &&
         (score.auxLabel || "");
}
// Get submission
var db_updateSubmission = function(data,eval,callback){
  let qry = {assignment:data.assignment_id};
  var update = {
    evaluation:eval._id,
  };
  if(isAllScoresAvailable(data.scores)){
    update['status'] = "evaluated";
  }


  submission.findOneAndUpdate(qry,update,{new:true},(err,result)=>{
    if(err){
      console.log('submission save error',err);
      err.data = 'submission save error';
      return callback(err,null);
    }

    for(var i = 0; i < result.formulation.length; i++){
      result.formulation[i].signature = data.signatures[i];
    }
      result.save(function(err){
        if(err){
          console.log('save submission fail:',err);
          err.data = 'save submission fail:';
          return callback(err,null);
        }
          console.log('submission updated: ',result);
          callback(null,result);
      });

  });

}

var db_createEvaluation = function(data,user,isEvaluated,subm,callback){
      let newEvaluation = {
        scores:{
          formulation:data.scores.formulation || "",
          calculation:data.scores.calculation || "",
          method:data.scores.method || "",
          packing:data.scores.packing || "",
          storageLabel:data.scores.storageLabel || "",
          mainLabel:data.scores.mainLabel || "",
          auxLabel:data.scores.auxLabel || ""
        },
        comments:{
          formulation:data.comments.formulation || "",
          calculation:data.comments.calculation || "",
          method:data.comments.method || "",
          packing:data.comments.packing || "",
          storageLabel:data.comments.storageLabel || "",
          mainLabel:data.comments.mainLabel || "",
          auxLabel:data.comments.auxLabel || ""
        },
        evaluatedBy:user._id
      };

    if(!isEvaluated && !subm.evaluation){
        if(subm.status !== 'submitted'){
          let error = new Error('Student has not yet submit his/her assignment');
          error.data = 'Student has not yet submit his/her assignment';
          callback(error,null);
        }else{
          evaluation.create(newEvaluation,(err,eval)=>{
            if(err){
              console.log('Evaluation created failed: ',err);
              err.data = 'Evaluation created failed';
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
          err.data="evaluation udpate fail";
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
      err.data = 'find submission error';
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
      err.data = 'error occurs';
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

var getPendingEvaluation = function(req,res,next){
   let qry = {status:"submitted"};

   submission.find(qry)
   .populate({
    path:'assignment',
    populate:{path:'template student'}
    })
   .sort({submission_date: 'descending'})
   .exec((err,result)=>{
      if(err){
        console.log('can not find the evaluation',err);
        err.data = 'can not find the evaluation';
        return next(err);
      }

      res.status(200).json(result);
   });
}

router.route('/getPendingEvaluation').get(verify.verifyInstructorUser,getPendingEvaluation);

/**************** Delete Routes ***************/
var removeAssignment = function(assignmentId,callback){
  var query = {_id:assignmentId};
  assign.remove(query,(err)=>{
    if(err){
      err.data = "assignment remove err";
      console.log(err);
      return callback(err,null);
    }
    console.log('assignment remove successful');
    callback(null,'done');
  });
}

var removeAssignmentFromStudent = function(assignmentId,callback){
  var query = {assignments:assignmentId};
  var update = {
    $pull:{
      assignments:assignmentId
    }
  };

  user.findOne(query)
      .update(update)
      .exec((err,user)=>{
        if(err){
          err.data="update user error";
          console.log(err.data,err);
          return callback(err,null);
        }
        console.log('assignment remove successful',user);
        callback(null,assignmentId);
      });
}

var removeSubmission = function(assignmentId,callback){
  var query = {assignment:assignmentId};
  submission.findOne(query,(err,result)=>{
    if(err){
      err.data = "submission already remove";
      console.log(err.data,err);
      return callback(null,assignmentId);
    }

    var fileDelete = function(path,callback){
      filesystem.unlink(path,(err)=>{
        if(err.code !== 'ENOENT'){
          console.log(err);
          return callback(err,null);
        }
        callback(null,'done');
      });
    }

  var fileDeleteTasks = [];
  if(result){
    if(result.storage){
      fileDeleteTasks.push(async.apply(fileDelete,result.storage));
    }
      if(result.main){
      fileDeleteTasks.push(async.apply(fileDelete,result.main));
    }
      if(result.Auxiliary){
      fileDeleteTasks.push(async.apply(fileDelete,result.Auxiliary));
    }
  }

  async.parallel(fileDeleteTasks,(err,result)=>{
      submission.remove(query,(err)=>{
        if(err){
          console.log(err);
          return callback(err,null);
        }
        console.log('submission delete successful');
        callback(null,assignmentId);
      });
  });
});
}

var deleteEvaluation = function(assignmentId,callback){
  var query = {assignment:assignmentId};
  submission.findOne(query,(err,result)=>{
    if(err){
      console.log('submission is deleted');
      return callback(null,assignmentId);
    }

    if(!result.evaluation){
      return callback(null,assignmentId);
    }
      
    var query_eval = {_id:result.evaluation}
    evaluation.remove(query_eval,(err)=>{
      if(err){
        err.data = 'evaluation remove error';
        console.log(err.data,err);
        return callback(err,null);
      }
      console.log('evaluation delete succesful');
      return callback(null,assignmentId);
    });

  });
}

var deleteTask = function(assignment,callback){
  var _deEval = async.apply(deleteEvaluation,assignment._id);
  async.waterfall([_deEval,removeSubmission,removeAssignmentFromStudent,removeAssignment],(err,result)=>{
    if(err){
      return callback(err,null);
    }
    callback(null,result);
  });
}

var deleteTemplate = function(templateId,callback){
  var query = {_id:templateId};
  template.findOne(query,(err,result)=>{
    if(err){ 
      err.data = "template remove error";
      console.log(err.data,err);
      return callback(err,null);
    }

    if(result){
      filesystem.unlink(result.prescription_url,(err)=>{
        if(err && err.code !== 'ENOENT'){
          console.log(err);
          return callback(err,null);
        }
          template.remove(query,(err)=>{
            console.log('template delete successful');
            callback(null,'done');
          });
      });
    }else{
      callback(null,'done');
    }

  });
}

var deleteAssignmentAndTemplate = function(req,res,next){
  var query = {template:req.query.template_id};
  assign.find(query,(err,result)=>{
    if(err){
      console.log('cannot find assignment;',err);
      err.data="cannot find assignment";
      return next(err);
  }

    var deleteFromStudents = function(callback){
      deleteTasks = [];
      for(var i = 0; i<result.length;i++){
        var _task = async.apply(deleteTask,result[i]);
        deleteTasks.push(_task);
      }
      async.parallel(deleteTasks,(err,result)=>{
      if(err){
        return callback(err,null);
      }
      callback(null,'done');
    });
  }

  var _deleteTemplate = async.apply(deleteTemplate,req.query.template_id);

    async.series([_deleteTemplate,deleteFromStudents],(err,results)=>{
      if(err){
        return next(err);
      }
      res.status(200).json('delete successful');
      next();
    });
  });
}

router.route('/deleteassignmentandtemplate').delete(verify.verifyInstructorUser,deleteAssignmentAndTemplate); 

var popAssignment = function(assignmentId,callback){
  var query = {assignments:assignmentId};
  var update = {
    $pull:{
      assignments:assignmentId
    }
  }
  user.find(query)
      .update(update)
      .exec((err,result)=>{
        if(err){
          err.data = "user assignment update error";
          console.log(err.data,err);
          return callback(err,null);
        }

        callback(null,result);
      });
}

var deleteAssignment = function(submission,callback){
  var query = {submission:submission._id};
  assign.findOne(query,(err,result)=>{
    if(err){
      err.data = "assignment find error";
      console.log(err.data,err);
      return callback(err,null);
    }

    assign.remove({_id:result._id},(err)=>{
    if(err){
      err.data = "submission remove error";
      console.log(err.data,err);
      return callback(err,null);
    }
      callback(null,result._id);
  });
});
}

var deleteSubmission = function(submission,callback){
  var query = {_id:submission._id};

  if(submission){
    submission.remove(query,(err)=>{
      if(err){
        err.data = "submission remove error";
        console.log(err.data,err);
        return callback(err,null);
      }

      if(submission.storage){
        filesystem.unlinkSync(submission.storage);
      }
      if(submission.main){
        filesystem.unlinkSync(submission.main);
      }
      if(submission.Auxiliary){
        filesystem.unlinkSync(submission.Auxiliary);
      } 
      callback(null,submission);
    });
  }
}

var checkEvaluationAndDelete = function(submission,callback){
  var query = {_id:submission.evaluation};
  evaluation.remove(query,(err)=>{
    if(err){
      err.data = "remove evaluation error";
      console.log(err.data,err);
      return callback(err,null);
    }
    callback(null,submission);
  });
}

var checkSubmission = function(assignmentId,callback){
  var query = {assignment:assignmentId};
  submission.findOne(query,(err,result)=>{
    if(err){
      err.data = 'submission find error:';
      console.log(err.data,err);
      return callback(err,null);
    }

    callback(null,result);

  });
}

var deleteAssignmentById = function(req,res,next){
  var assignmentId = req.query.assignment_id;
  var query = {assignment:assignmentId};

  var firstTask = async.apply(checkSubmission,assignmentId);
  async.waterfall([firstTask,
                   checkEvaluationAndDelete,
                   deleteSubmission,
                   deleteAssignment,
                   popAssignment],(err,result)=>{
    if(err){
      return next(err);
    }
    res.status(200).json('successful');
  });
}

router.route('/deleteassignmentById').delete(verify.verifyInstructorUser,deleteAssignmentById); 
module.exports = router;
