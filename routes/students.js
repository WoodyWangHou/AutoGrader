var express = require('express');
var router = express.Router();
var async = require('async');

var verify = require('../utils/VerifyUser');
var folderCheck = require('../utils/checkFileUploadFolder');
var paths = require('../utils/paths');
var path = require('path');

var assign = require ('../models/assignment');
var user = require('../models/user');
var template = require('../models/template');
var submission = require('../models/submission');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,paths.STUDENT_SUBMISSION+"/"+req.decoded._doc.enrollment_year.toString());
  },
  filename: function (req, file, cb) {
    var date = new Date();
    cb(null, req.decoded._doc.username + '-'
             + date.getDate() + '-'
             + (date.getMonth()+1) +'-' 
             + date.getFullYear()
             + file.originalname);
  }
});
var upload = multer({storage:storage});

var getAssignments = function(req,res,next){
  var user = req.decoded._doc;
  var qry = {student:user._id};

  assign.find(qry)
        .populate({path:'template submission student'})
        .sort({"template.deadline":"ascending"})
        .exec((err,result)=>{
          if(err){
            console.log('cannot find assignment',err);
            err.data = 'cannot find assignment';
            return next(err);
          }

          res.status(200).json(result);
        });
}

router.route('/assignments').get(verify.verifyOrdinaryUser, getAssignments);

var getAssignmentById = function(req,res,next){
  var assignmentId = req.query.assignment_id;
  var qry = {_id:assignmentId};

  assign.findOne(qry)
  .populate({
    path:"template student"
  })
  .populate({
    path:"submission",
    populate:{
      path:'evaluation'
    }
  })
  .exec((err,result)=>{
    if(err){
      console.log('cannot find assignment',err);
      err.data = 'cannot find assignment';
      return next(err);
    }
    res.status(200).json(result);
  });
}

router.route('/getassignmentbyid').get(verify.verifyOrdinaryUser,getAssignmentById);

var appendUpdateData = function(submissionToUpdate,data,callback){
  for(var key in data){
    if(key === 'formulation'){
      submissionToUpdate.set({formulation:[]});
      for(var index in data.formulation){
       let formu = {        
            ingredient_name:data[key][index].ingredient_name,
            official_quantity:data[key][index].official_quantity,
            used_quantity:data[key][index].used_quantity,
            actual_quantity_weighted:data[key][index].actual_quantity_weighted,
            signature:""
        };
        submissionToUpdate.formulation.push(formu);
      }
    }else if(key === 'calculation'){
      submissionToUpdate.calculation = data[key];
    }else if(key === 'method'){
      submissionToUpdate.method = data[key];
    }else if(key === 'packing'){
      submissionToUpdate.packing = data[key];
    }else if(key === 'status'){
      submissionToUpdate.status = data[key];
    }
   }
   submissionToUpdate.submission_date = new Date() ;
   if(callback){
    return callback(null,submissionToUpdate);
   }
}

var addFile = function(fileUrl,submission,data,callback){
    if(fileUrl){
      switch(data.identity){
        case 'storage':
          submission.storage = fileUrl;
        break;
        case 'mainLabel':
          submission.main = fileUrl;
        break;
        case 'auxLabel':
          submission.Auxiliary = fileUrl;
        break;
      }
      return callback(null,submission);
    }else{
      var err = new Error('No file');
      return callback(err,null)
    }
}

var saveUpdate = function(updatedSubmission,callback){
  updatedSubmission.save((err)=>{
      if(err){
        console.log('submission update save fail:',err);
        err.data = 'submission update save fail:';
        return callback(err,null);
      }
      callback(null,'done');
  });
}

var updateSubmission = function(data,callback){
  var qry={assignment:data.assignment_id};
  submission.findOne(qry,(err,result)=>{
    if(err){
      console.log('cannot find submission',err);
      err.data = 'cannot find submission';
      return callback(err,null);
    }
    callback(null,result,data);     
  });
}

var saveSubmitAssignment = function(req,res,next){
  if(req.file){
    // set update tasks
      var destUrl = path.resolve(req.file.path);
      var serverPath = path.join(__dirname, '/../public');
      destUrl = destUrl.replace(serverPath,'');

      var findSubmission = async.apply(updateSubmission,req.body);
      var _addFile = async.apply(addFile,destUrl);
      async.waterfall([findSubmission,_addFile,saveUpdate],(err,result)=>{
          if(err){
            return next(err);
          }
          res.status(200).json('New assignment file upload successfully!');
          next();
        });
     
  }else{
    var findSubmission = async.apply(updateSubmission,req.body);
    async.waterfall([findSubmission,appendUpdateData,saveUpdate],(err,result)=>{
      if(err){
        return next(err);
      }
      res.status(200).json('Assignment data Saved/Submitted Successful!');
      next();
    });
  }

}

router.route('/updateorsubmitassignment').post(verify.verifyOrdinaryUser,
                                               folderCheck.checkSubmisisonDir,
                                               upload.single('file'),
                                               saveSubmitAssignment);

/**
  Request for student list
**/
var studentListRequest = function(req,res,next){
  var request = {is_instructor:false};
  var query = user.find(request)
            .populate({
              path:'assignments',
              populate:{path:'template submission student'}
            })
            .exec((err,data)=>{
              if(err){
                console.log('cannot find users:',err);
                err.data = 'cannot find users:';
                return next(err);
              }
                res.json(data);
                next();
            });
}

router.route('/studentlist').get(verify.verifyOrdinaryUser, studentListRequest);
module.exports = router;
