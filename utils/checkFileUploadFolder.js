var path = require('path');
var filesystem =require('fs');
var async = require('async');

var paths = require('./paths');

var checkAndCreateFilesDir = function(callback){
  filesystem.access(paths.FILES,filesystem.constants.F_OK,(err)=>{
    if(err){
        filesystem.mkdir(paths.FILES,(err)=>{
          if(err){
            console.log("folder creation error:",err);
            err.data = "folder creation error:";
            return callback(err,null);
          }
        });
    }
    callback(null,true);
  });
}

var checkAndCreatePrescriptionDir = function(isFileDirCreated,callback){
  filesystem.access(paths.PRESCRIPTION,filesystem.constants.F_OK,(err)=>{
          if(err){
            filesystem.mkdir(paths.PRESCRIPTION,(err)=>{
              if(err){
                console.log("folder creation error:",err);
                err.data = "folder creation error:";
                return callback(err,null);
              }
                callback(null,'done');
            });
          }else{
            callback(null,'done');
          }
  });
}

exports.checkUploadDir = function(req,res,next){
  async.waterfall([checkAndCreateFilesDir,checkAndCreatePrescriptionDir],(err,result)=>{
    if(err){
      return next(err);
    }
    next();
  });
}

var checkAndCreateSubmissionDir = function(callback){
  filesystem.access(paths.STUDENT_SUBMISSION,filesystem.constants.F_OK,(err)=>{
          if(err){
            filesystem.mkdir(paths.STUDENT_SUBMISSION,(err)=>{
              if(err){
                console.log("folder creation error:",err);
                err.data = "folder creation error:";
                return callback(err,null);
              }
                callback(null,true);
            });
          }else{
            callback(null,true);
          }
  });
}

var checkAndCreateSubDir = function(user,callback){
	var enroll_year = user.enrollment_year;
	var subFolder = path.join(paths.STUDENT_SUBMISSION,enroll_year.toString());
	filesystem.access(subFolder,filesystem.constants.F_ok,(err)=>{
		if(err){
			filesystem.mkdir(subFolder,(err)=>{
				if(err){
					console.log('submission sub folder creation error:',err);
					err.data = 'submission sub folder creation error';
					return callback(err,null);
				}
				callback(null,'done');
			});
		}else{
			callback(null,true);
		}
	});
}

exports.checkSubmisisonDir = function(req,res,next){
  let createSub = async.apply(checkAndCreateSubDir,req.decoded._doc);
  async.series([checkAndCreateFilesDir,checkAndCreateSubmissionDir,createSub],(err,result)=>{
    if(err){
      return next(err);
    }
    next();
  });
}