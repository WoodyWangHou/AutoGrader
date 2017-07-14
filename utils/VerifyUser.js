var User = require('../models/user');
var jwt = require('jsonwebtoken');
//require config file
var config = require('../config');

exports.getToken = function(user){
  return jwt.sign(user,(config.secretKey ||""),{
    algorithm: 'HS256',
    expiresIn: "7d"
  });
}

exports.verifyOrdinaryUser = function(req,res,next){
  var token = req.body.token || req.query.token || req.headers["x-access-token"];
  //get token
  if(token){
    jwt.verify(token,config.secretKey,function(err,decoded){
      if(err){
        //if there is err, create a self-defined error
        var err = new Error('You are not authorized');
        err.status = 401;
        next(err);
      }else{
        //attach the token in the decoded message
        req.decoded = decoded;
        next();
      }
    });
  }else{
    var err = new Error('Token is missing!');
    err.status = 403;
    next(err);
  }
}

exports.verifyInstructorUser = function(req,res,next){
  var token = req.body.token || req.query.token || req.headers["x-access-token"];
  //get token
  if(token){
    jwt.verify(token,config.secretKey,function(err,decoded){
      if(err){
        //if there is err, create a self-defined error
        var err = new Error('You are not authorized');
        err.status = 401;
        return next(err);
      }else{
        //attach the token in the decoded message
        if(decoded._doc.is_instructor === false){
          var err = new Error('You do not have instructors\'s right');
          err.status = 401;
          return next(err);
        }else{
        req.decoded = decoded;
        next();
        }
      }
    });
  }else{
    var err = new Error('Token is missing!');
    err.status = 403;
    return next(err);
  }
}

exports.verifyStudentUser = function(req,res,next){
  var token = req.body.token || req.query.token || req.headers["x-access-token"];
  //get token
  if(token){
    jwt.verify(token,config.secretKey,function(err,decoded){
      if(err){
        //if there is err, create a self-defined error
        var err = new Error('You are not authorized');
        err.status = 401;
        return next(err);
      }else{
        //attach the token in the decoded message
        if(decoded._doc.is_instructor === true){
          var err = new Error('You cannot get Student \' page, Please check the student List');
          err.status = 401;
          return next(err);
        }else{
        req.decoded = decoded;
        next();
        }
      }
    });
  }else{
    var err = new Error('Token is missing!');
    err.status = 403;
    return next(err);
  }
}