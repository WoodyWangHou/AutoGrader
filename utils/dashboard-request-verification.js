var vri = require('./VerifyUser');

var verify = function(req,res,next){
	if(isRequestDashboard(req)){
		vri.verifyOrdinaryUser(req,res,next);
	}else{
		next();
	}
}

var isRequestDashboard = function(req){
	if(req.url.indexOf('dashboard.html') != -1){
		return true;
	}else{
		return false;
	}
}

module.exports = verify;