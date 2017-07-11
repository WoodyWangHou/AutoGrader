var vri = require('./VerifyUser');

var verify = function(req,res,next){
	if(isRequestStudent(req)){
		vri.verifyStudentUser(req,res,next);
	}else{
		next();
	}
}

var isRequestStudent = function(req){
	if(req.url.indexOf('student/home-main/home-main.html') != -1){
		return true;
	}else{
		return false;
	}
}

module.exports = verify;