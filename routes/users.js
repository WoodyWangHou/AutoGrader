var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    verify = require('../utils/VerifyUser');

var user = require('../models/user');

/* GET users listing. */
router.post('/register',function(req,res){
  user.register(new user({username:req.body.username}),
    req.body.password,function(err,user){
      if(err){
        return res.status(500).json({
          error:"This Matric Number has been registered!"
        });
      }
      createUser(user,req.body);

      user.save(function(err,user){
          passport.authenticate('local')(req,res,function(){
          return res.status(200).json({status: 'Registraton Successful'});
      });
    });

  });
});

var createUser = function(user,user_data){
      if(user_data.username){
        user.username = user_data.username;
      }
      if(user_data.is_instructor){
        user.is_instructor = user_data.is_instructor;
      }
      if(user_data.first_name){
        user.first_name = user_data.first_name;
      }
      if(user_data.last_name){
        user.last_name = user_data.last_name;
      }
      if(user_data.enrollment_year){
        user.enrollment_year = user_data.enrollment_year;
      }
}

router.post('/login',function(req,res,next){
  passport.authenticate('local',function(err,requester,info){
    // a callback logic to check login info
    if(err){
        next(err);
    }
    // user not found
    if(!requester){
      return res.status(401).json({
        error:"Password or Username is incorrect, please enter again"
      });
    }
    // when the user info is found
    req.logIn(requester,function(err){
      if(err){
        next(err);
      }

      var token = verify.getToken(requester);
      var is_instructor = user.findById(requester._id);
      is_instructor.exec(function(err,user){
          if(err){
            next(err);
          }
            //return token
          res.status(200).json({
          is_instructor:user.is_instructor,
          token: token
        });
      });

    });
  })(req,res,next);
});
router.get('/logout',function(req,res,next){
  // some log out procedures, not implemented at the moment
  req.logout();
  res.status(200).json({
    status: 'Bye'
  });
});

module.exports = router;
