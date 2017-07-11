var express = require('express');
var router = express.Router();
var query = require('../utils/Query');
var verify = require('../utils/VerifyUser');

var assign = require ('../models/assignment');
var user = require('../models/user');

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

router.route('/studentlist').get(verify.verifyInstructorUser, studentListRequest);
/***********************************
* ROUTER FOR QUERYING STUDENT INFO
*************************************/
router.route('/')
.get(verify.verifyOrdinaryUser,function(req,res,next){
        var qry = {username:req.decoded._doc.username};
        user.findOne(qry, function(err,result){
          if(err) next(err);
          if(!result){
            var error = new Error("User does not have any assignment");
            error.status = 404;
            return next(error);
          }
          qry = {toBeCompletedBy:result._id};
          assign.find(qry)
          .populate('issuedBy')
          .populate('toBeCompletedBy')
          .exec(function(err,assigment){
            if(err) next(err);
            if(!assigment){
              var error = new Error("User does not have any assignment");
              error.status = 404;
              return next(error);
            }
            res.json(assigment);
            next();
          });
        });
})
.put(verify.verifyOrdinaryUser,function(req, res, next){
        req.model = user;
        req.qry = {username:req.decoded._doc.username};
        req.update = req.body;
        query.put(req,res,next);
})
.delete(verify.verifyOrdinaryUser,function(req, res, next){
        res.send({message:'DELETE NOT SUPPORTED'});
        next();
        //NOT SUPPORTED AT THE MOMENT
});
/************************************************
* ROUTER FOR ACCESSING STUDENT's own ASSIGNMENT
************************************************/
router.route('/assignments/:aName')
.get(verify.verifyOrdinaryUser,function(req,res,next){
  //client need to provide assignmentName explicitly
  var assignName = req.params.aName || req.body.assignmentName;
  var qry = {username:req.decoded._doc.username};
  user.findOne(qry, function(err,result){
      if(err) next(err);
      qry = {
        'assignmentDetail.assignmentName':assignName,
        toBeCompletedBy: result._id
      };
      assign.findOne(qry,function(err,assignment){
        if(err) next(err);
        if(!assignment){
          var error = new Error("User does not have "+assignName+" assignment");
          error.status = 404;
          return next(error);
        }
        res.status(200).json(assignment);
      });
  });
})
.put(verify.verifyOrdinaryUser,function(req, res, next){
    var assignName = req.params.aName || req.body.assignmentName;
    var qry = {username:req.decoded._doc.username};
    user.findOne(qry,function(err,result){
      if(err) next(err);
      qry = {
        toBeCompletedBy:result._id,
        'assignmentDetail.assignmentName':assignName
      };
      req.body.assignmentName = assignName;
      var update = {assignmentDetail:req.body};
      assign.findOneAndUpdate(qry,update,function(err,result){
        if(err) next(err);
        assign.findOne(qry,function(err,finalResult){
          if(err) next(err);
          if(!finalResult){
            var error = new Error("Cannot find the update");
            error.status = 404;
            next(error);
          }else{
          res.status(200).json(finalResult);
          }
        });
      });
    });
})
.delete(verify.verifyOrdinaryUser,function(req, res, next){
    //NOT SUPPORTED AT THE MOMENT
    res.send({message:'DELETE NOT SUPPORTED'});
    next();
});

module.exports = router;
