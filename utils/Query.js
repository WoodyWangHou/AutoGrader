var express = require('express');
var router = express.Router();

var users = require('../models/user');
var assign = require('../models/assignment');

var Query = {
    put:function(req,res,next){
      req.model.update(req.qry,req.update,function(err, result){
          if(err)  next(err);
          req.model.findOne(req.qry,function(err,result){
            if(err)  next(err);//return sId 0 - not found
            if(!result){
              var error = new Error("Cannot find such object");
              error.status = 404;
               next(error);
            }else{
              console.log(result);
              res.json(result);
              next();
            }
          });
        });
    }
};
module.exports = Query;
