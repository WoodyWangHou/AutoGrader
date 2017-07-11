var vri = require('./VerifyUser');

var verify = function(req,res,next){
	if(isRequestInstructor(req)){
		vri.verifyInstructorUser(req,res,next);
	}else{
		next();
	}
}

var isRequestInstructor = function(req){
	if(req.url.indexOf('instructor/home-main/home-main.html') != -1){
		return true;
	}else{
		return false;
	}
}

module.exports = verify;